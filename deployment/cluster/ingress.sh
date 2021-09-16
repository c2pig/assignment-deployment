#!/bin/sh

set -e
set -o pipefail
set -u 
: "$SERVICE_DOMAIN"
: "$ELB_ADDRESS"

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
