<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard',
  },
});

const { signIn } = useAuth();

const mode = ref<'login' | 'create'>('login');
const name = ref('');
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

const title = computed(() => (mode.value === 'login' ? 'Log in' : 'Create account'));
const submitLabel = computed(() => (mode.value === 'login' ? 'Log in' : 'Create account'));
const toggleLabel = computed(() => (mode.value === 'login' ? 'Need an account?' : 'Already have an account?'));

async function submit() {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    if (mode.value === 'create') {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: name.value || undefined,
          email: email.value,
          password: password.value,
        },
      });
    }

    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.error) {
      errorMessage.value = 'Email or password is incorrect.';
      return;
    }

    await navigateTo('/dashboard');
  } catch (error: any) {
    errorMessage.value = error?.data?.message ?? 'Something went wrong. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10">
    <form class="w-full max-w-sm flex flex-col gap-4" @submit.prevent="submit">
      <vTitle box="0 0 800 150" class="w-full h-20">{{ title }}</vTitle>

      <label v-if="mode === 'create'" class="flex flex-col gap-1">
        <span class="font-semibold">Name</span>
        <input
          v-model="name"
          type="text"
          autocomplete="name"
          class="p-3 border border-black rounded bg-white"
          placeholder="Your name"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="font-semibold">Email</span>
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="p-3 border border-black rounded bg-white"
          placeholder="you@example.com"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="font-semibold">Password</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          minlength="8"
          class="p-3 border border-black rounded bg-white"
          placeholder="At least 8 characters"
        />
      </label>

      <p v-if="errorMessage" class="text-red-700 font-semibold" role="alert">{{ errorMessage }}</p>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="border border-black rounded bg-pink-100 hover:bg-pink-200 disabled:opacity-60 px-4 py-3 font-bold"
      >
        {{ isSubmitting ? 'Working...' : submitLabel }}
      </button>

      <button
        type="button"
        class="underline underline-offset-4 w-fit mx-auto"
        @click="mode = mode === 'login' ? 'create' : 'login'; errorMessage = ''"
      >
        {{ toggleLabel }}
      </button>
    </form>
  </main>
</template>
