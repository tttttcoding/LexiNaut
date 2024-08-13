## 项目简介
LexiNaut-智能语航是一款基于LLM的本地知识库项目, 基于Langchain-chatchat(0.3.1)进行二次开发, 其归属于ZISU
核心功能包括:
- LLM对话
- RAG对话、知识库管理
- Agent对话 & 管理

## 项目说明
项目目前通过两个项目分别组成前后端, 放弃原有二次开发逻辑

### 技术栈
前端
- Vue 全家桶
- TS

后端 & 模型
- FastAPI
- Langchain
- xinference

详细文档见原项目内.md文档说明、技术栈相关官方文档

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

v 0.3 (8.9 - 8.13)
- 架构调整
- xinference后端接入
