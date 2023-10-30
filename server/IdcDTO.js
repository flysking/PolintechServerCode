class IdcDTO {
    constructor({
      idc_id,
      idc_mid,
      idc_postdate,
      idc_isaccept,
    }) {
      this.idc_id = idc_id;
      this.idc_mid = idc_mid;
      this.idc_postdate = idc_postdate;
      this.idc_isaccept=idc_isaccept;
    }
    toJSON() {
      return {
        idc_id: this.idc_id,
        idc_mid: this.idc_mid,
        idc_postdate : this.idc_postdate,
        idc_isaccept: this.idc_isaccept,
      };
    }
  }
  
  module.exports = IdcDTO;