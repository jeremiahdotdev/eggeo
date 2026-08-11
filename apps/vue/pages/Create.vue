<script setup lang="ts">
import { $createEgg } from '~/composables/gateway/egg';
const title = defineModel<string>('title');
const description = defineModel<string>('description');
const color = defineModel<string>('color');
const points = defineModel<number>('points');
const numberOfEggs = defineModel<number>('numberOfEggs');

const refError = ref<string>();
const isDisabled = ref(false);
points.value = 1;
numberOfEggs.value = 1;

const handleSubmit = async () => {
  isDisabled.value = true;
  const trimTitle = title.value?.trim();
  const trimDescription = description.value?.trim();
  const trimColor = color.value?.trim();

  if (!!trimTitle || !!trimDescription) {
    const [response, error] = await $createEgg(numberOfEggs.value, {
      title: trimTitle,
      description: trimDescription,
      color: trimColor,
      points: points.value ?? 1,
    });
    isDisabled.value = false;
    if (response && !error) {
      title.value = undefined;
      description.value = undefined;
      numberOfEggs.value = 1;
      points.value = 1;
    } else if (error) {
      refError.value = error;
    }
  }
};
</script>

<template>
  <div class="h-screen max-w-screen justify-center items-center flex flex-col my-16 pb-16">
    <vLabel box="0 0 900 100" class="w-full p-4 sm:w-1/2">Create an Egg</vLabel>
    <form class="w-full max-w-screen-md justify-center items-center flex flex-col gap-4" @submit.prevent="handleSubmit">
      <FormField label="Title">
        <input
          v-model="title"
          type="text"
          placeholder="Enter title..."
          required
          class="w-full shadow-xl p-2 mx-4 border border-gray-300 rounded"
        />
      </FormField>
      <FormField label="Description">
        <textarea
          v-model="description"
          placeholder="Enter description..."
          required
          class="w-full shadow-xl p-2 mx-4 border border-gray-300 rounded"
        ></textarea>
      </FormField>
      <FormField label="Points per egg">
        <input
          v-model="points"
          type="number"
          placeholder="Point per egg"
          class="w-full shadow-xl p-2 mx-4 border border-gray-300 rounded"
        />
      </FormField>
      <FormField label="Color">
        <input v-model="color" type="color" class="w-full shadow-xl rounded h-16 border border-gray-300 rounded" />
      </FormField>
      <FormField label="Number of Eggs">
        <input
          v-model="numberOfEggs"
          type="number"
          required
          class="w-full shadow-xl p-2 mx-4 border border-gray-300 rounded"
        />
      </FormField>
      <FormField>
        <button
          :disabled="isDisabled"
          type="submit"
          :class="`w-full shadow-xl p-2 m-4 bg-blue-500 text-white p-4 rounded border border-black my-[1px] hover:border-2 hover:my-0 active:bg-blue-400 ${
            isDisabled ? 'opacity-50' : ''
          }`"
          aria-label="create-button"
        >
          Submit
        </button>
      </FormField>
      <i v-if="refError" class="w-full p-2 px-4 text-red-1200">{{ refError }}</i>
    </form>
  </div>
</template>
