<template>
  <div>
    <h2 class="title">管理後台</h2>
    <table>
      <thead>
        <tr>
          <td>id</td>
          <td>Email</td>
          <td>預約類型</td>
          <td>預約時間</td>
          <td>預約狀態</td>
          <td>創建時間</td>
          <td>最後更新時間</td>
          <td>刪除日期</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>
            <router-link :to="'/order/'+order.id">{{order.id}}</router-link>
          </td>
          <td>{{order.email}}</td>
          <td>{{order.type}}</td>
          <td>{{order.order_date}}</td>
          <select class="input-area" v-model="order.status">
            <option v-for="type in ORDER_STATUS" :key="type" :value="type" required>
              {{type}}
            </option>
          </select>
          <td>{{order.createAt}}</td>
          <td>{{order.modifyAt}}</td>
          <td>{{order.deleteAt}}</td>
          <td><button @click.prevent="update(order)">更新</button></td>
        </tr>
      </tbody>
    </table>
    <router-link to="/admin/status" class="admin-router-btn">查看統計</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      ORDER_STATUS: ['pending', 'processing', 'reject', 'finish'],
      orders: [
        {
          id: '',
          email: '',
          type: '',
          order_date: '',
          status: '',
          createAt: '',
          modifyAt: '',
        },
      ],
    };
  },
  mounted: async function() {
    try {
      let res = await axios.get('/api/order');
      if (res.data && res.data.data) {
        return (this.orders = res.data.data.map(o => {
          // reformat order date
          const format = 'YYYY-MM-DD';
          o.createAt = moment(o.createAt).format(format);
          o.modifyAt = moment(o.modifyAt).format(format);
          o.order_date = moment(o.order_date).format(format);
          return o;
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
  methods: {
    async update(order) {
      try {
        let res = await axios.put(`/api/order/${order.id}`, {
          status: order.status,
        });
        if (res.data) {
          order.modifyAt = moment().format('YYYY-MM-DD');
          return alert('更新狀態成功');
        }
        throw new Error('SERVER_ERROR');
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
