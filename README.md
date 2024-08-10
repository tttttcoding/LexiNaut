## 项目简介
LexiNaut-智能语航是一款基于LLM的本地知识库项目, 基于Langchain-chatchat(0.3.1)进行二次开发, 其归属于ZISU
核心功能包括:
- LLM对话
- RAG对话、知识库管理
- Agent对话 & 管理

## 项目说明
### 目录
```
总览
常用的在data、libs、frontend这三个地方
  |- data
    |- knowledge_base   向量数据库
    |- logs             运行日志
  |- docker             Docker部署相关文件
  |- frontend           前端
  |- libs               后端
  |- tools              CLI工具 & 辅助工具
  | xxx.yaml            各种配置项


```
### 技术栈
前端
- Vue 全家桶
- TS


后端 (Python)
- FastAPI
- Langchain
- StreamLit (后端自带Web UI)

详细文档见原项目内.md文档说明、技术栈相关官方文档

## 项目启动

预备事项
- 做好文件夹管理
- 做好备份

实测下来, Windows和Linux上均可, Linux安装和启动更加稳定
- 磁盘需要预留10-20G, 用于安装依赖以及LLM、Embedding模型

### 代码克隆
```
  > git clone xxx(当前项目的远程代码)
```


### 依赖安装

设置镜像
Python设置国内镜像, 以提速
```
  阿里源
  > pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

安装依赖
1. 切换到v0.1版本的分支
2. 切换到项目目录下, 安装所需依赖 (建议切换到独立虚拟环境安装), 安装过程很漫长
```
  > pip install -r requirements.txt
```

遇到chatglm-cpp-python的bug, 需要github下载源文件手动安装
需要对应到自己的python版本以及OS, 比如windows python3.11对应xxx-cp311-win_amd64.whl: https://github.com/li-plus/chatglm.cpp
```
  > pip install ./xxx
```



### 模型安装
启动XINFERENCE, 模型下载 & 加载框架
Linux下启动
```
  XINFERENCE_MODEL_SRC=modelscope xinference-local --host 0.0.0.0 --port 9997
```
windows下启动
```
  设置环境变量
  > set XINFERENCE_MODEL_SRC=modelscope
  启动
  > xinference-local --host 127.0.0.1 --port 9997
```

打开本地9997端口, 下载两个模型:
   - LLM模型: Qwen2-instructa
     - Model Engine: transformers
     - Model Format: pytorch
     - Model Size: 根据自己电脑情况选, 越大性能要求越高
     - Quantization: 同上, None性能要求最高
     - N-GPU: auto
     - Replica: 1
   - Embedding模型: Bge-large-zh-v1.5
     - 按默认下载, CPU运行的, Device中选择CPU

按最低配置, 较低档次的16G内存的核显轻薄本完全可以流畅运行, 内存占用大概会到90%, 运行时关掉其它内存占用较大的应用
低配置的LLM问答输出会较慢, 这是正常的


### 启动

1. 在XINFERENCE中启动LLM模型和Embedding模型, 配置同上一步
   - 遇到Quantization报错的, 试着三个量化(4bit、8bit、None)都换着启动, 这个报错有点玄学
2. 项目根目录中启动chatchat api
```
  > chatchat start -a
```
打开对应的端口, 与自带的streamlit页面可以正常对话, 且终端无报错, 即启动成功




## 更新日志
v 0.1 (2024.8.2-5)
- 项目平台接入 & 初始化
- 平台测试: windows & Linux & 云
- 文档更进

v 0.2（8.6 - 8.8）
- 环境bug修复
- 项目结构调整
  - 前端整体更换
- 文档更进
- 后端基础功能接入调试