set -u 
: "$SERVICE_NAME"

cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: ${SERVICE_NAME}
spec:
  selector:
    app: demo-backend
  type: LoadBalancer
  ports:
   -  protocol: TCP
      port: 80
      targetPort: 8080
EOF