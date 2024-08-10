<template>
  <form class="w-full h-screen" @submit="onSubmit">

    <div class="w-[720px] h-[500px] bg-white md:grid grid-cols-2 rounded-md shadow-sm translate-y-32 md:translate-y-0">
      <div class="p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-center text-gray-700 text-lg">用户登陆</h2>
          <div class="mt-8">
            <yInput v-model="values.account" @input="validate"></yInput>
            <Error :error="errors.account"></Error>
            <yInput v-model="values.password" class="mt-5" @input="validate" :isPassword="true"></yInput>
            <Error :error="errors.password"></Error>
          </div>
          <YButton class="w-full">登录</YButton>
          <div class="flex justify-center mt-3">
            <icon-wechat theme="outline" size="24" fill="#fff"
              class="bg-green-600 text-white rounded-full p-1 cursor-pointer" aria-hidden="true" />
          </div>
        </div>
        <div class="flex gap-3 justify-center mt-10">
          <y-link title="忘记密码" path="/404"></y-link>
          <y-link title="注册" path="/registry"></y-link>
        </div>
      </div>
      <div class="hidden md:block relative">
        <img src="/images/login.jpg" class="absolute h-full w-full object-cover" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import Error from "@/components/y/error.vue";
import v from "../../plugins/validate";
import { login } from "../../utils/user";
const { useForm, useFields, yup } = v;

const schema = yup.object({
  account: yup
    .string()
    .required()
    .matches(/^\d{11}|.+@.+$/, "请输入邮箱")
    .label("账号"),
  password: yup.string().required().min(4, "密码不少于4位").label("密码"),
});
const { handleSubmit, values, errors, validate } = useForm({
  validationSchema: schema,
});

useFields(Object.keys(schema));
const onSubmit = handleSubmit(async (values: any) => {
  const { account, password } = values;
  const formData = new URLSearchParams();
  formData.append("username", account);
  formData.append("password", password);
  login(formData).then((r) => {
    console.log("r", r);
  });
});
</script>

<style lang="scss">
form {
  @apply bg-slate-300 h-screen flex justify-center items-start md:items-center p-5;
}
</style>
