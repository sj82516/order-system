<template>
  <div>
    <h2 class="title">預約資訊</h2>
    <div class="info">
      <div class="column">
        <p class="column__title">Email</p>
        <p class="column__content">{{order.email}}</p>
      </div>
      <div class="column">
        <p class="column__title">預約類型</p>
        <p class="column__content">{{order.type}}</p>
      </div>
      <div class="column">
        <p class="column__title">預約狀態</p>
        <p class="column__content">{{order.status}}</p>
      </div>
      <div class="column">
        <p class="column__title">預約日期</p>
        <p class="column__content">{{order.order_date}}</p>
      </div>
      <div class="column">
        <p class="column__title">備註</p>
        <p class="column__content">{{order.content}}</p>
      </div>
    </div>
    <router-link to="/admin" class="admin-router-btn">前往管理後台</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      order: {
        email: '',
        id: '',
        type: '',
        status: '',
        order_date: '',
        content: '',
      },
    };
  },
  mounted: async function() {
    let id = this.$route.params.id;
    if (!id || id === '') {
      alert('需指定訂單編號');
      return this.$router.push('/');
    }
    try {
      let res = await axios.get(`/api/order/${id}`);
      if (res.data && res.data.data) {
        res.data.data.order_date = moment(res.data.data.order_date).format("YYYY-MM-DD")
        return (this.order = res.data.data);
      }
      throw 'error';
    } catch (error) {
      if (error.response && error.response.data) {
        return alert(error.response.data.msg);
      }
      return alert('伺服器錯誤');
    }
  },
  methods: {
    submit() {
      console.log(de.errorHandle({msg: 'test'}));
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  width: 100%;
  margin: auto;
  max-width: 450px;
  border: 1px solid orange;
  box-sizing: border-box;
}

.column {
  width: 100%;
  padding: 0;
  display: flex;
  border: 1px solid orange;
  &__title {
    width: 30%;
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid orange;
    margin: 0;
    padding: 10px;
  }

  &__content {
    width: 70%;
    box-sizing: border-box;
    border: 1px solid orange;
    margin: 0;
    padding: 10px;
  }
}
</style>
