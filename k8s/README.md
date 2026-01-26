# Azure Kubernetes Service (AKS) Deployment Setup

This guide will help you deploy the Simplify School backend to Azure Kubernetes Service.

## Prerequisites

1. Azure Container Registry (ACR)
2. Azure Kubernetes Service (AKS) cluster
3. Azure CLI installed locally
4. kubectl installed locally

## Setup Instructions

### 1. Configure GitHub Secrets

You need to add the following secrets to your GitHub repository:

Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

#### Required Secrets:

1. **AZURE_CREDENTIALS** - Azure Service Principal credentials

   ```bash
   # Create a service principal and get credentials
   az ad sp create-for-rbac --name "simplify-school-github-actions" \
     --role contributor \
     --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME> \
     --sdk-auth
   ```

   Copy the entire JSON output and paste it as the secret value.

2. **POSTGRES_USER** - PostgreSQL username from your Azure Database for PostgreSQL

3. **POSTGRES_PASSWORD** - PostgreSQL password from your Azure Database for PostgreSQL

4. **POSTGRES_HOST** - Azure PostgreSQL hostname (e.g., `myserver.postgres.database.azure.com`)

5. **POSTGRES_DB** - Database name (e.g., `postgres` or your custom database name)

### 2. Update Configuration Files

#### Update k8s/k8s-deployment.yaml:

1. Replace `<your-acr-name>` with your Azure Container Registry name

2. Update the database connection details in the Secret section with your Azure Database for PostgreSQL information:
   ```yaml
   POSTGRES_USER: "<your-postgres-user>"
   POSTGRES_PASSWORD: "<your-postgres-password>"
   POSTGRES_HOST: "<your-azure-postgres-host>.postgres.database.azure.com"
   POSTGRES_DB: "postgres"
   ```

#### Update .github/workflows/deploy-backend-aks.yml:

Update the environment variables at the top (lines 13-17):

```yaml
env:
  AZURE_CONTAINER_REGISTRY: <your-acr-name> # e.g., simplifyschoolacr
  IMAGE_NAME: simplify-school-backend
  AKS_CLUSTER_NAME: <your-aks-cluster-name>
  AKS_RESOURCE_GROUP: <your-aks-resource-group>
```

### 3. Grant AKS Access to ACR

Your AKS cluster needs permission to pull images from your ACR:

```bash
# Get your ACR ID
ACR_ID=$(az acr show --name <your-acr-name> --query id --output tsv)

# Get your AKS kubelet identity
KUBELET_ID=$(az aks show --name <your-aks-cluster-name> --resource-group <your-resource-group> --query identityProfile.kubeletidentity.clientId --output tsv)

# Assign AcrPull role
az role assignment create --assignee $KUBELET_ID --scope $ACR_ID --role AcrPull
```

### 4. Configure Azure PostgreSQL Firewall

Ensure your Azure Database for PostgreSQL allows connections from your AKS cluster:

```bash
# Allow Azure services to access your PostgreSQL server
az postgres server firewall-rule create \
  --resource-group <your-postgres-resource-group> \
  --server-name <your-postgres-server-name> \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

Note: For better security, you can restrict access to your AKS cluster's outbound IP addresses instead of allowing all Azure services.

### 5. Deploy Manually (First Time)

For the first deployment, you may want to deploy manually to ensure everything is configured correctly:

```bash
# Login to Azure
az login

# Get AKS credentials
az aks get-credentials --resource-group <your-resource-group> --name <your-aks-cluster-name>

# Create namespace
kubectl create namespace simplify-school

# Create secrets
kubectl create secret generic backend-secret \
  --from-literal=POSTGRES_USER=<your-postgres-user> \
  --from-literal=POSTGRES_PASSWORD=<your-postgres-password> \
  --from-literal=POSTGRES_HOST=<your-host>.postgres.database.azure.com \
  --from-literal=POSTGRES_DB=<your-database-name> \
  --namespace=simplify-school

# Apply the deployment
kubectl apply -f k8s/k8s-deployment.yaml

# Check status
kubectl get all -n simplify-school

# Get the external IP of the backend service
kubectl get service backend-service -n simplify-school
```

### 6. Trigger Automated Deployment

Once configured, the GitHub Action will automatically deploy when you:

- Push changes to the `main` branch that affect:
  - `backend/**`
  - `k8s/**`
  - The workflow file itself
- Or manually trigger it from the Actions tab in GitHub

## Monitoring and Troubleshooting

### View Pod Logs:

```bash
kubectl logs -f deployment/backend -n simplify-school
```

### View Pod Status:

```bash
kubectl get pods -n simplify-school
kubectl describe pod <pod-name> -n simplify-school
```

### Check Services:

```bash
kubectl get services -n simplify-school
```

### Access the Backend:

Once deployed, get the external IP:

```bash
kubectl get service backend-service -n simplify-school
```

The backend will be accessible at: `http://<EXTERNAL-IP>/assignments`

## Important Notes

1. **Production Considerations:**
   - The current setup uses a LoadBalancer service type which will create an Azure Load Balancer (additional cost)
   - Consider using an Ingress controller for production (e.g., NGINX Ingress)
   - Update the CORS configuration in your Go backend to allow your frontend domain
   - Configure SSL/TLS for secure connections to Azure Database for PostgreSQL

2. **Security:**
   - Store sensitive data in GitHub Secrets (never commit secrets to the repository)
   - Use Azure Key Vault for production secrets
   - Implement network policies to restrict traffic between pods

3. **Scaling:**
   - Backend is configured with 2 replicas (adjust as needed)
   - Configure Horizontal Pod Autoscaler (HPA) for automatic scaling

4. **Cost Optimization:**
   - Add resource limits to containers to control costs
   - Use Azure Spot instances for non-critical workloads
   - Consider Azure Container Apps as a simpler alternative

## Next Steps

1. Update the configuration files with your actual Azure resource names
2. Add the required GitHub secrets
3. Grant ACR access to AKS
4. Test the deployment
5. Configure your frontend to connect to the backend's external IP
6. Set up monitoring with Azure Monitor or Application Insights
