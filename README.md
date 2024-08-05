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
常用的在data、frontend、libs这三个地方
  |- data
    |- knowledge_base   向量数据库
    |- logs             运行日志
  |- docker             Docker部署相关文件
  |- docs               官方提供的文档
  |- frontend           前端
  |- libs               后端
  |- markdown_docs      官方提供的文档
  |- tools              CLI工具 & 辅助工具
  | xxx.yaml            各种配置项


```
### 技术栈
前端
- Next
- React全家桶
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

实测下来, Linux上安装和启动更加稳定; Windows已知有麻烦的安装问题, 不能完全保证顺利安装
- 建议OS使用Linux; Windows笔记本的, 用WSL
- 有N卡的更好, 显卡不是N卡的, 可能要多折腾一段时间
- 磁盘预留10-20G, 用于安装依赖以及LLM、Embedding模型

### 代码克隆
```
  > git clone xxx(当前项目的远程代码)
```


### 依赖安装

设置镜像
Python最好设置国内镜像, 以提速
```
  阿里源
  > pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
  清华源测下来有问题, 不要用清华的
```
安装依赖
1. 切换到v0.1版本的分支
2. 切换到项目目录下, 安装所需依赖 (建议切换到独立虚拟环境安装), 安装时间会比较长
```
  > pip install -r requirements.txt
```

### 初始化
进入到项目目录中
```
  > chatchat init
```

### 启动
模型部分
1. 启动XINFERENCE, 模型下载 & 加载框架
```
  XINFERENCE_MODEL_SRC=modelscope xinference-local --host 0.0.0.0 --port 9997
```
2. 打开本地9997端口, 下载两个模型:
   - LLM模型: Qwen2-instruct
   - Embedding模型: Bge-large-zh-v1.5
3. 启动这两个模型



## 更新日志
v 0.1 (2024.8.2-5)
- 项目平台接入 & 初始化
- 项目文档更进
- 平台测试: windows & Linux & 云