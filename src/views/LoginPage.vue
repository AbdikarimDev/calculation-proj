<template>
  <div class="flex min-h-screen w-full">
    <!-- Left Side - Blue Section -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex-col justify-between p-12"
    >
      <!-- Top content -->
      <div>
        <h1 class="text-4xl font-bold mb-4">NovaPOS</h1>
        <p class="text-blue-100 text-lg">Complete Point of Sale Solution</p>
      </div>

      <!-- Center content - Features -->
      <div class="space-y-8">
        <div class="flex items-center space-x-4">
          <div class="bg-blue-500/30 p-3 rounded-lg">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-lg">Fast Processing</h3>
            <p class="text-blue-100 text-sm">
              Quick checkout and inventory management
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="bg-blue-500/30 p-3 rounded-lg">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-lg">Secure & Reliable</h3>
            <p class="text-blue-100 text-sm">Your data is always protected</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="bg-blue-500/30 p-3 rounded-lg">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-lg">Real-time Reports</h3>
            <p class="text-blue-100 text-sm">
              Track sales and inventory instantly
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom content -->
      <div>
        <p class="text-blue-200 text-sm">
          © 2024 NovaPOS. All rights reserved.
        </p>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50"
    >
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <h1 class="text-3xl font-bold text-blue-600">NovaPOS</h1>
          <p class="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <!-- Tab Switcher -->
        <div class="flex gap-4 mb-8 border-b border-gray-200">
          <button
            @click="activeTab = 'login'"
            :class="[
              'pb-3 px-4 font-medium transition-colors duration-200',
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Sign In
          </button>
          <button
            @click="activeTab = 'signup'"
            :class="[
              'pb-3 px-4 font-medium transition-colors duration-200',
              activeTab === 'signup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Create Account
          </button>
        </div>

        <!-- Login Form -->
        <form
          v-if="activeTab === 'login'"
          @submit.prevent="handleLogin"
          class="space-y-6"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Email Address</label
            >
            <input
              type="email"
              v-model="loginForm.email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              type="password"
              v-model="loginForm.password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700"
              >Forgot password?</a
            >
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Signing in..." : "Sign In" }}
          </button>
        </form>

        <!-- Sign Up Form -->
        <form
          v-if="activeTab === 'signup'"
          @submit.prevent="handleSignup"
          class="space-y-6"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Full Name</label
            >
            <input
              type="text"
              v-model="signupForm.name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Email Address</label
            >
            <input
              type="email"
              v-model="signupForm.email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              type="password"
              v-model="signupForm.password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Create a password"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Confirm Password</label
            >
            <input
              type="password"
              v-model="signupForm.confirmPassword"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Creating account..." : "Create Account" }}
          </button>
        </form>

        <!-- Error/Success Message -->
        <div
          v-if="message"
          :class="[
            'mt-4 p-3 rounded-lg text-sm',
            messageType === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700',
          ]"
        >
          {{ message }}
        </div>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref as dbRef, set } from 'firebase/database'

const router = useRouter()
const emit = defineEmits(['login-success'])

// State
const activeTab = ref('login')
const loading = ref(false)
const message = ref('')
const messageType = ref('error')

// Form data
const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})


// In your handleLogin function, replace router.push with:
const handleLogin = async () => {
  loading.value = true
  message.value = ''

  try {
    await signInWithEmailAndPassword(auth, loginForm.value.email, loginForm.value.password)
    await router.push('/pos') // ✅ No more window.location.href
  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
// Handle Signup
const handleSignup = async () => {
  // Validate passwords match
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    message.value = 'Passwords do not match!'
    messageType.value = 'error'
    return
  }

  // Validate password length
  if (signupForm.value.password.length < 6) {
    message.value = 'Password must be at least 6 characters!'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupForm.value.email,
      signupForm.value.password
    )

    // Save user data to Realtime Database
    await set(dbRef(db, `users/${userCredential.user.uid}`), {
      name: signupForm.value.name,
      email: signupForm.value.email,
      createdAt: Date.now(),
      role: 'user'
    })

    console.log('Account created:', userCredential.user)
    message.value = 'Account created successfully! Please sign in.'
    messageType.value = 'success'

    // Switch to login tab after 1.5 seconds
    setTimeout(() => {
      activeTab.value = 'login'
      loginForm.value.email = signupForm.value.email
      signupForm.value = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
      message.value = ''
    }, 1500)

  } catch (error) {
    console.error(error)
    if (error.code === 'auth/email-already-in-use') {
      message.value = 'An account already exists with this email'
    } else if (error.code === 'auth/invalid-email') {
      message.value = 'Please enter a valid email address'
    } else if (error.code === 'auth/weak-password') {
      message.value = 'Password should be at least 6 characters'
    } else {
      message.value = error.message
    }
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>