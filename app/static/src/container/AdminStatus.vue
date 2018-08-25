<template>
  <div>
    <h2 class="title">管理後台</h2>
    <table>
      <thead>
        <tr>
          <td>日期</td>
          <td>A</td>
          <td>B</td>
          <td>C</td>
          <td>D</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="status in statusList" :key="status.date">
          <td>
            {{status.date}}
          </td>
          <td>{{status.A || 0}}</td>
          <td>{{status.B || 0}}</td>
          <td>{{status.C || 0}}</td>
          <td>{{status.D || 0}}</td>
        </tr>
      </tbody>
    </table>
    <router-link to="/admin" class="admin-router-btn">返回管理後台</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      statusList: [
        {
          date: '',
          A: 0,
        },
      ],
    };
  },
  mounted: async function() {
    try {
      let res = await axios.get('/api/order/dashboard/status');
      if (res.data && res.data.data) {
        return (this.statusList = Object.keys(res.data.data).map(k => {
          let status = {
            date: k,
          };
          Object.assign(status, res.data.data[k]);
          return status;
        }));
      }
      throw new Error('SERVER_ERROR');
    } catch (error) {
      if (error.response && error.response.data) {
        return alert(error.response.data.msg);
      }
      return alert('伺服器錯誤');
    }
  },
};
</script>

<style lang="scss" scoped>
table {
  border-spacing: 0;
  width: 80vw;
  margin: auto;
}

table thead tr td {
  border-bottom: 2px solid black;
  background: none;
}

table tr td {
  padding: 5px;
}

tr:nth-child(2n) {
  height: 50px;
  line-height: 50px;
}
tr:nth-child(2n + 1) {
  background: rgba(230, 135, 0, 0.5);
  height: 50px;
  line-height: 50px;
}
</style>
