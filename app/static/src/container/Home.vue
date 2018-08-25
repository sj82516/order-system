<template>
  <div>
    <h2 class="title">請填寫預約資訊</h2>
    <form>
      <div class="input-field">
        <label class="input-label" for="email">Email</label>
        <input class="input-area" id="email" type="email" v-model="order.email" default="輸入合法email" required>
      </div>
      <div class="input-field">
        <label class="input-label" for="type">預約類型</label>
        <select class="input-area" v-model="order.type">
          <option v-for="type in ORDER_TYPE" :key="type" :value="type" required>
            {{type}}
          </option>
        </select>
      </div>
      <div class="input-field">
        <label class="input-label" for="date">預約日期</label>
        <datepicker class="input-area" id="date" v-model="order.order_date"></datepicker>
      </div>
      <div class="input-field">
        <label class="input-label" for="content">備註</label>
        <input class="input-area" id="content" type="text" v-model="order.content" default="可輸入1~100字的英文" required>
      </div>
      <button class="submit" @click.prevent="submit" :disabled="isValid">送出</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import validator from 'validator';
import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    Datepicker,
  },
  data() {
    return {
      ORDER_TYPE: ['A', 'B', 'C', 'D'],
      order: {
        email: '',
        order_date: new Date(),
        content: '',
        type: 'A',
      },
    };
  },
  methods: {
    async submit() {
      try {
        // validate
        if (this.order.email === '' || !validator.isEmail(this.order.email)) {
          return alert('請填寫正確Email格式');
        }
        console.log(this.order.order_date);
        if (new Date(this.order.order_date) < new Date()) {
          return alert('預約日期須大於現在');
        }
        if (!validator.isAlpha(this.order.content)) {
          return alert('備註僅可填寫大小寫的英文字母');
        }

        let res = await axios.post('/api/order', this.order);
        if (res && res.data && res.data.data) {
          alert('創建成功');
          this.$router.push({
            path: `/order/${res.data.data.id}`,
          });
        }
      } catch (error) {
        if (error.response && error.response.data) {
          return alert(error.response.data.msg);
        }
        return alert('伺服器錯誤');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  width: 100%;
  margin: auto;
  max-width: 450px;
  border: 5px solid orange;
  padding: 20px;
  box-sizing: border-box;
}

.input-field {
  width: 100%;
  padding: 0;
  display: flex;
  margin-bottom: 30px;
}

.input-label {
  width: 30%;
  display: inline-block;
  box-sizing: border-box;
}

.input-area {
  width: 70%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.submit {
  background: orange;
  width: 100%;
  border-radius: 5px;
  border: none;
  color: white;
  height: 50px;
  line-height: 50px;
}
</style>
