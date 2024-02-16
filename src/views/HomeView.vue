<template>
  <div>
    <h1>Latihan Mengetik</h1>
    <div v-if="!isStarted">Klik "Mulai" untuk memulai tes mengetik.</div>
    <div v-else>
      <p v-if="!isTimeUp" v-html="formattedPrompt"></p>
      <input v-model="userInput" @input="checkTyping" @keyup.space="nextWord" :disabled="isTimeUp">
      <button @click="nextPrompt" :disabled="isTimeUp">Next</button>
      <p v-if="isTimeUp">Waktu Habis! Kecepatan Mengetik: {{ typingSpeed }} kata per menit</p>
      <p v-if="isStarted && !isTimeUp">Waktu Tersisa: {{ countdown }} detik</p>
    </div>
    <button @click="startTest" :disabled="isStarted">Mulai</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prompts: [
        ["pensil", "rumah", "lemari", "kasur", "pintu", "kemana", "siapa", "bukan", "karena", "kamu", "di", "dan", "mereka", "tidak", "jatuh", "bawah"],
        // Tambahkan prompts lain jika diperlukan
      ],
      currentPromptIndex: 0,
      currentPrompt: [],
      currentWordIndex: 0,
      howMuchWordType: 0,
      userInput: "",
      isStarted: false,
      isTimeUp: false,
      startTime: 0,
      endTime: 0,
      errorCount: 0,
      typingSpeed: 0,
      countdown: 60
    };
  },
  computed: {
    formattedPrompt() {
      const wordsBeforeCurrent = this.currentPrompt.slice(0, this.currentWordIndex);
      const wordsAfterCurrent = this.currentPrompt.slice(this.currentWordIndex + 1);
      const currentWord = this.currentPrompt[this.currentWordIndex];

      return [
        ...wordsBeforeCurrent.map(word => `<span>${word}</span>`),
        `<span style="color: red">${currentWord}</span>`,
        ...wordsAfterCurrent.map(word => `<span>${word}</span>`)
      ].join(' ');
    }
  },
  methods: {
    setNextPrompt() {
      this.currentPrompt = this.prompts[this.currentPromptIndex];
      this.currentWordIndex = 0;
    },
    nextPrompt() {
      if (this.isStarted && !this.isTimeUp) {
        this.currentPromptIndex = (this.currentPromptIndex + 1) % this.prompts.length;
        this.setNextPrompt();
        this.userInput = "";
        this.startTime = Date.now();
        this.endTime = 0;
        this.errorCount = 0;
        this.typingSpeed = 0;
      }
    },
    nextWord() {
      if (this.isStarted && !this.isTimeUp) {
        this.currentWordIndex = (this.currentWordIndex + 1) % this.currentPrompt.length;
        this.userInput = "";  // Menambahkan perintah untuk mengosongkan input setelah menekan spasi
        this.howMuchWordType++
      }
    },
    checkTyping() {
      if (this.userInput.trim() === this.currentPrompt[this.currentWordIndex]) {
        // Perbarui startTime sebelum pengguna mulai mengetik kata yang benar
        if (!this.startTime) {
          this.startTime = Date.now();
        }

        // Perbarui endTime setelah pengguna mengetik kata yang benar
        this.endTime = Date.now();

        const wordsTyped = this.userInput.trim().split(/\s+/).length;
        const timeInSeconds = Math.max((this.endTime - this.startTime) / 1000, 0);
        // const timeInMinutes = timeInSeconds / 60;
        this.typingSpeed = Math.round((wordsTyped / 5) / (timeInSeconds / 60));
        sessionStorage.setItem('hasil', this.typingSpeed);
        console.log("Typing Speed:", this.typingSpeed);
      } else {
        this.errorCount = this.calculateErrors();
        console.log(`Error: ${this.errorCount}`)
      }
    },
    calculateErrors() {
      const currentWord = this.currentPrompt[this.currentWordIndex];
      const userInputWord = this.userInput.trim();

      let errors = 0;
      const minLength = Math.min(currentWord.length, userInputWord.length);

      for (let i = 0; i < minLength; i++) {
        if (currentWord[i] !== userInputWord[i]) {
          errors++;
        }
      }

      errors += Math.abs(currentWord.length - userInputWord.length);

      return errors;
    },
    startTest() {
      this.isStarted = true;
      this.countdown = 60;
      this.isTimeUp = false;
      this.startCountdown();
      this.setNextPrompt();
    },
    startCountdown() {
      this.countdown = 60;

      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.endTest();
          clearInterval(this.countdownInterval);
        }
      }, 1000);
    },

    endTest() {
      this.isTimeUp = true;
      this.isStarted = false;
      clearInterval(this.countdownInterval);

      // Menggunakan setTimeout untuk memberi waktu agar state terbarui sebelum alert muncul
      setTimeout(() => {
        alert(`Waktu Habis! Kecepatan Mengetik: ${this.howMuchWordType} kata per menit`);
      }, 0);
    },

  },
};
</script>

<style scoped>
/* Your CSS styles go here */
</style>
