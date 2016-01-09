``` bash
docker run \
  -it \
  --link mongo \
  --name=styco \
  -p 80:5000 \
  -u root \
  -w /opt/app \
  -v $(pwd):/opt/app \
  styers/styco-site /bin/bash
```
