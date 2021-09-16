#!/bin/sh

set -e
set -o pipefail
set -u 
: "$SERVICE_DOMAIN"
: "$SERVICE_NAME"

ELB=$(kubectl get service ${SERVICE_NAME} -o json | jq -r '.status.loadBalancer.ingress[].hostname')

cat << EOF > route53.yml
AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  ServiceDomain:
    Type: String
    Default: ${SERVICE_DOMAIN}.
Resources:
  RecordSetGroup:
    Type: "AWS::Route53::RecordSetGroup"
    Properties:
      HostedZoneName: !Ref DomainName
      RecordSets:
      - Name: !Ref ServiceDomain 
        Type: CNAME
        TTL: '300'
        ResourceRecords:
          - '${ELB}'
EOF
