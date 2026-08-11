<template>
  <form class="flex flex-col gap-4 w-full pt-8" @submit.prevent="handleSubmit">
    <input v-model="title" type="text" placeholder="Title" required class="p-2 border border-gray-300 rounded" />
    <textarea
      v-model="description"
      placeholder="Description"
      required
      class="p-2 border border-gray-300 rounded"
    ></textarea>
    <input v-model="username" type="text" placeholder="User" required class="p-2 border border-gray-300 rounded" />
    <input v-model="color" type="color" required class="w-full h-16 border border-gray-300 rounded" />
    <button
      :disabled="isDisabled"
      type="submit"
      :class="{ 'bg-blue-100': isDisabled }"
      class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      aria-label="submit-button"
    >
      Submit
    </button>
    <i v-if="error?.text" class="text-red-600">{{ error.text }}</i>
  </form>
</template>

<script setup>
import { addEgg } from '~/composables/gateway/egg';
const title = defineModel('title');
const description = defineModel('description');
const username = defineModel('username');
const color = defineModel('color');
const coords = reactive({});
const error = reactive({});
const isDisabled = ref(false);
const setError = (e) => {
  error.text = e;
};

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      coords.lat = position.coords.latitude;
      coords.lng = position.coords.longitude;
    });
  }
});

const handleSubmit = async () => {
  isDisabled.value = true;
  const trimTitle = title.value.trim();
  const trimDescription = description.value.trim();
  const trimUsername = username.value.trim();

  if (!!trimTitle || !!trimDescription || !!trimUsername) {
    const response = await $addEgg({
      title: trimTitle,
      description: trimDescription,
      username: trimUsername,
      coords,
      color,
    });
    if (response) {
      title.value = undefined;
      description.value = undefined;
      username.value = undefined;
    }
    isDisabled.value = false;
  }
};
</script>
