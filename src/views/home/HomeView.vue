<template>
  <div>
    <div class="container">
      <div class="wrapper">
        <div class="header">
          <h3 style="user-select: none; border: 1px solid #B6EADA;">Latihan Mengetik</h3>
          <h3 @click="login">Mau masuk leaderboard? login dulu sini</h3>
          <h3 @click="about">About?</h3>
        </div>
        <div class="content">
          <div class="prompt">
            <div class="text">
              <p v-if="this.countdown != 0" v-html="formattedPrompt"></p>
            </div>
            <div class="input-text">
              <input class="text-form" v-model="userInput" v-if="isStarted" @keyup.space="nextWord"
                placeholder="Ayo Ketikk.....">
              <button class="btn-mulai" v-if="!isStarted" @click="startTest" :disabled="isStarted">Mulai</button>
              <div class="timer animate__animated animate__bounceInRight" v-if="isStarted">{{ countdown }}</div>
            </div>
          </div>
          <div class="leaderboard">
            <p>Yaow ini adalah leaderboard</p>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>WPM</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Sabar</td>
                  <td>Masih</td>
                  <td>Ngoding</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Sabar</td>
                  <td>Masih</td>
                  <td>Ngoding</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Sabar</td>
                  <td>Masih</td>
                  <td>Ngoding</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Sabar</td>
                  <td>Masih</td>
                  <td>Ngoding</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Sabar</td>
                  <td>Masih</td>
                  <td>Ngoding</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Sabar</td>
                  <td>Masih</td>
                  <td>Ngoding</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert'
import "animate.css"

export default {
  data() {
    return {
      prompts: [
        ["pensil", "rumah", "lemari", "kasur", "pintu", "kemana", "siapa",
          "bukan", "karena", "kamu", "di", "dan", "mereka", "tidak", "jatuh",
          "bawah", "tahu", "oleh", "kembali", "siap", "memiliki", "dengan", "kamu",
          "anak", "harus", "ada", "baru", "lama", "tinggi", "setiap", "kembali", "mengatakan",
          "tidak", "harus", "dengan", "pergi", "lama", "bukan", "jam", "mana", "beritahu"],
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
      countdown: 60,
      maxPromptLines: 2,
    };
  },
  computed: {
    formattedPrompt() {
      const wordsBeforeCurrent = this.currentPrompt.slice(0, this.currentWordIndex);
      const wordsAfterCurrent = this.currentPrompt.slice(this.currentWordIndex + 1);
      const currentWord = this.currentPrompt[this.currentWordIndex] ? this.currentPrompt[this.currentWordIndex] : "";

      return [
        ...wordsBeforeCurrent.map((word) => `<span>${word}</span>`),
        `<span style="color: ${wordsBeforeCurrent.length === this.currentWordIndex ? 'red' : 'inherit'}">${currentWord}</span>`,
        ...wordsAfterCurrent.map(word => `<span>${word}</span>`)
      ].join(' ');
    }
  },
  methods: {
    about() {
      swal({
        icon: false,
        title: 'Sulit aseli buatnya',
        text: '--Radya--',
        button: 'Okeh'
      })
    },
    login() {
      swal({
        icon: 'error',
        title: 'Belum ada ya',
        text: 'Kapan adanya? kapan kapan 😂'
      })
    },
    setNextPrompt() {
      this.currentPrompt = this.shuffleArray(this.prompts[this.currentPromptIndex]);
      this.currentWordIndex = 0;
    },
    shuffleArray(array) {
      let currentIndex = array.length, randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    },
    nextWord() {
      if (this.isStarted && !this.isTimeUp) {
        this.currentWordIndex = (this.currentWordIndex + 1) % this.currentPrompt.length;
        this.userInput = "";
        this.howMuchWordType++;

        this.scrollPrompt();
      }
    },
    scrollPrompt() {
      const promptContainer = document.querySelector('.text');
      const currentWordElement = promptContainer.querySelector(`span:nth-child(${this.currentWordIndex + 1})`);

      if (currentWordElement) {
        const containerHeight = promptContainer.clientHeight;
        const currentWordHeight = currentWordElement.clientHeight;
        const currentWordOffsetTop = currentWordElement.offsetTop;

        const scrollTo = currentWordOffsetTop - containerHeight + currentWordHeight;

        promptContainer.scrollTo({
          top: scrollTo,
          behavior: 'smooth',
        });
      }
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
      setTimeout(() => {
        swal({
          icon: false,
          title: "STOPPP!! Waktu Habis",
          text: `Hmm kecepatan mengetik kamu adalah ${this.howMuchWordType} WPM (Kata permenit)`,
          button: 'tutup',
          closeOnClickOutside: false
        })
      }, 0);
    },

  },
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #03001C;
  color: #B6EADA;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer {
  width: 50px;
  height: 50px;
  background-color: #03001C;
  position: fixed;
  right: 100px;
  border-radius: 50%;
  border: 5px solid #B6EADA;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
}

.wrapper {
  /* border: 1px solid red; */
  width: 90%;
  height: 90vh;
}

.header {
  /* border: 1px solid black; */
  display: flex;
  height: 10%;
}

.header h3 {
  background-color: #03001C;
  padding: 10px 20px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #B6EADA;
}

.wrapper h3:nth-child(n+2) {
  margin-left: 50px;
  cursor: pointer;
}

.content {
  /* border: 1px solid blue; */
  width: 100%;
  height: 90%;
}

.prompt {
  /* border: 1px solid green; */
  width: 100%;
  height: 50%;
}

.text {
  /* border: 1px solid red; */
  border-radius: 0 10px 10px 10px;
  width: 100%;
  height: 50%;
  background-color: #03001C;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  overflow-y: scroll;
  scrollbar-color: #03001C #e0e0e0;
  scrollbar-width: none;
}

.text p {
  /* border: 1px solid yellow; */
  margin-left: 15px;
  margin-top: 100px;
  line-height: 2;
}

.input-text {
  /* border: 1px solid blue; */
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 20px;
  width: 70%;
  height: 30%;
  background-color: #03001C;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-form {
  border: none;
  box-sizing: border-box;
  margin-right: 25px;
  padding: 10px;
  padding-right: 200px;
  border-radius: 10px;
  font-size: 1.2rem;
}

.btn-mulai {
  border: none;
  border-radius: 10px;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: bolder;
  cursor: pointer;
  background-color: #B6EADA;
  color: #03001C;
}

.leaderboard {
  border: 1px solid black;
  background-color: #03001C;
  width: 100%;
  height: 50%;
  overflow-y: auto;
  scrollbar-color: #03001C #e0e0e0;
  scrollbar-width: auto;
  border-radius: 10px;
}

.leaderboard p {
  text-align: center;
  margin-top: 10px;
  font-weight: bolder;
}

table {
  margin: 0 auto;
  width: 90%;
  margin-top: 10px;
}

table,
tr,
th {
  border: 2px solid #B6EADA;
  border-collapse: collapse;
  padding: 5px;
}

th {
  background-color: #B6EADA;
  color: #03001C;
}

table,
tr,
td {
  border: 2px solid #B6EADA;
  border-collapse: collapse;
  padding: 5px;
  text-align: center;
  margin-bottom: 5px;
}
</style>
