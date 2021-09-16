#!/bin/bash
set -ex
set -u 
: "$CLUSTER_NAME"

# Note: if this command running from pipeline make sure AWS_DEFAULT_REGION, aws_access_key_id, aws_secret_access_key is in place
#       otherwise assume right privillege INSTANCE_PROFILE is set or ~/.aws/credentials default profile is there
# Note: eksclt command will take 20 mins

CLUSTER_YML=cluster.yml
cat << EOF > $CLUSTER_YML
---
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: ${CLUSTER_NAME}
  region:  ap-southeast-1
  version: "1.21"

availabilityZones: ["ap-southeast-1a", "ap-southeast-1b", "ap-southeast-1c"]

managedNodeGroups:
- name: nodegroup
  desiredCapacity: 3
  instanceType: t3a.small
EOF

eksctl get cluster --name $CLUSTER_NAME -o json

[ $? -eq 0 ] && {
  echo "cluster exit, skip remaining steps"
  exit
}

eksctl create cluster -f $CLUSTER_YML

STACK_NAME=$(eksctl get nodegroup --cluster $CLUSTER_NAME -o json | jq -r '.[].StackName')
CLUSTER_ROLE_NAME=$(aws cloudformation describe-stack-resources --stack-name $STACK_NAME | jq -r '.StackResources[] | select(.ResourceType=="AWS::IAM::Role") | .PhysicalResourceId')
CLUSTER_ROLE_ARN=$(aws iam get-role --role-name ${CLUSTER_ROLE_NAME} --query Role.Arn --output text)

eksctl create iamidentitymapping  \
  --cluster $CLUSTER_NAME \
  --arn ${CLUSTER_ROLE_ARN} \
  --group system:masters \
  --username admin 

aws iam get-role \
  --role-name "AWSServiceRoleForElasticLoadBalancing" || aws iam create-service-linked-role --aws-service-name "elasticloadbalancing.amazonaws.com"

##
## Note: run `kubectl describe configmap -n kube-system aws-auth`
# and expect to see:
# - groups:
#   - system:masters
#   rolearn: arn:aws:iam::<aws_account_id>:role/eksctl-demo-nodegroup-nodegroup-NodeInstanceRole-<random>
#   username: admin
