# plott-life-frontend

```shell
gcloud builds submit --config cloudbuild/deploy.yaml --substitutions=SHORT_SHA=$(git rev-parse --short HEAD)
```

```
docker build -t plott-life-front -f apps/web/Dockerfile .
```
