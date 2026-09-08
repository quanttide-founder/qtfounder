# syntax=docker/dockerfile:1

# ---- 构建阶段 ----
# provider 仅用标准库（无 CGO 依赖），静态编译即可
#
# 构建上下文约定：仓库根（qtfounder 单仓库布局），
# 数据源 fiction / memory 由 CI checkout 到仓库根 assets/ 下后打入镜像（只读快照）。
# 用法：docker build -f src/provider/Dockerfile -t qtfounder-provider:latest .
FROM golang:1.26-alpine AS build

# 依赖代理：默认国内可达的 goproxy.cn（proxy.golang.org 在部分网络环境不可达）
# 覆盖：docker build --build-arg GOPROXY=https://proxy.golang.org,direct .
ARG GOPROXY=https://goproxy.cn,direct
ENV GOPROXY=${GOPROXY}

WORKDIR /src

COPY src/provider/go.mod src/provider/
RUN cd src/provider && go mod download

COPY src/provider src/provider
RUN cd src/provider && CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/provider-server ./cmd/server

# ---- 运行阶段 ----
FROM alpine:3.20

RUN addgroup -S app && adduser -S -G app app
COPY --from=build /out/provider-server /usr/local/bin/provider-server

# 数据源：fiction / memory 构建时打入镜像（随镜像版本固定的只读快照，更新数据 = 重新部署）
COPY assets/fiction /data/fiction
COPY assets/memory /data/memory

USER app
ENV QTFOUNDER_FICTION_PATH=/data/fiction \
    QTFOUNDER_MEMORY_PATH=/data/memory
EXPOSE 8080

# 访问密钥由运行时环境变量 QTFOUNDER_SECRET_KEY 注入（FC 环境变量，见 manifests/terraform）
ENTRYPOINT ["provider-server"]
