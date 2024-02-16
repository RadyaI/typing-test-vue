<template>
  <div>
    <h1>Latihan Mengetik</h1>
    <div v-if="!isStarted">Klik "Mulai" untuk memulai tes mengetik.</div>
    <div v-else>
      <span v-if="!isTimeUp">{{ currentPrompt }}</span> <br>
      <input v-model="userInput" @input="checkTyping" @keyup.space="nextPrompt" :disabled="isTimeUp">
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
      prompts: ["besok", "untuk", "pensil", "kos", "oleh", "banyak", "boleh", "di", "sore"],
      currentPromptIndex: 0,
      currentPrompt: "",
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
  methods: {
    setNextPrompt() {
      // Pilih prompt secara acak
      const randomIndex = Math.floor(Math.random() * this.prompts.length);
      this.currentPromptIndex = randomIndex;

      this.currentPrompt = this.prompts[randomIndex];
    },
    nextPrompt() {
      if (this.isStarted && !this.isTimeUp) {
        this.setNextPrompt();
        this.userInput = "";
        this.startTime = Date.now();
        this.endTime = 0;
        this.errorCount = 0;
        this.typingSpeed = 0;
      }
    },
    checkTyping() {
      if (!this.startTime) {
        this.startTime = Date.now();
        this.startCountdown();
      }

      if (this.userInput === this.currentPrompt) {
        this.endTime = Date.now();
        const wordsTyped = this.userInput.trim().split(/\s+/).length;
        const timeInSeconds = (this.endTime - this.startTime) / 1000; // Ubah ke detik
        const timeInMinutes = timeInSeconds / 60; // Ubah ke menit
        this.typingSpeed = Math.round(wordsTyped / timeInMinutes);

        // Simpan WPM ke sessionStorage
        sessionStorage.setItem('hasil', this.typingSpeed);
      } else {
        this.errorCount = this.calculateErrors();
        sessionStorage.setItem('error', this.errorCount)
      }
    },
    calculateErrors() {
      let errors = 0;
      for (let i = 0; i < this.currentPrompt.length; i++) {
        if (this.currentPrompt[i] !== this.userInput[i]) {
          errors++;
        }
      }
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
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.userInput = ""
          this.currentPrompt = ""
          this.endTest();
          clearInterval(countdownInterval);
        }
      }, 1000);
    },
    endTest() {
      this.isTimeUp = true;
      this.isStarted = false;

      clearInterval(this.countdownInterval); // Hentikan interval countdown

      alert(`Waktu Habis! Kecepatan Mengetik: ${sessionStorage.getItem("hasil")} kata per menit`);
    }
  }
};
</script>

<style scoped>
/* Your CSS styles go here */
</style>
