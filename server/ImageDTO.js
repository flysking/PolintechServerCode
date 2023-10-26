class ImageDTO {
    constructor({
      image_id,
      image_name,
      image_category,
      image_postdate,
      image_mid,
    }) {
      this.image_id = image_id;
      this.image_name = image_name;
      this.image_category =  image_category;
      this.image_postdate = image_postdate;
      this.image_mid = image_mid;
    }
    toJSON() {
      return {
        image_id: this.image_id,
        image_name: this.image_name,
        image_category: this.image_category,
        image_postdate: this.image_postdate,
        image_mid: this.image_mid,
      };
    }
  }
  
  module.exports = ImageDTO;
  