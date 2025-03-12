'use strict';

module.exports = {

  async getHomeDeviceData({ homey, query }) {
    return await homey.app.tibberAppApi.get('/home_device_data?device_id='+query.device_id, {});
  }
};