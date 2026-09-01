# Storefront on its own, or included by the workspace Tiltfile.
docker_compose(['docker/compose.yaml'], project_name='shop-storefront')

dc_resource('storefront-web', labels=['storefront'], links=['http://localhost:5173'])
