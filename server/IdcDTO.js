class IdcDTO {
    constructor({
      idc_id,
      idc_mid,
      idc_postdate,
      idc_isaccept,
      member_name,
      major_name,
    }) {
      this.idc_id = idc_id;
      this.idc_mid = idc_mid;
      this.idc_postdate = idc_postdate;
      this.idc_isaccept=idc_isaccept;
      this.member_name=member_name;
      this.major_name=major_name;
    }
    toJSON() {
      return {
        idc_id: this.idc_id,
        idc_mid: this.idc_mid,
        idc_postdate : this.idc_postdate,
        idc_isaccept: this.idc_isaccept,
        member_name:this.member_name,
        major_name:this.major_name,
      };
    }
  }
  
  module.exports = IdcDTO;