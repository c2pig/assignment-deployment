set -u 
: "$SERVICE_NAME"

cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${SERVICE_NAME}
  labels:
    app: ${SERVICE_NAME}
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${SERVICE_NAME}
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: ${SERVICE_NAME}
    spec:
      containers:
      - image: 198798184407.dkr.ecr.ap-southeast-1.amazonaws.com/payroll-backend:latest
        imagePullPolicy: Always
        name: ${SERVICE_NAME}
        ports:
        - containerPort: 8080
          protocol: TCP
EOF
