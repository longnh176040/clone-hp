export class Laptop {
  constructor(
    public _id: string,
    public laptop_id: string,
    public brand: string,
    public name: string,
    public series: string,
    public CPU: {
      name: string;
      speed: string;
      cache: string;
    },
    public RAM: {
      capacity: string;
      socket_number: string;
    },
    public storage: string,
    public display: string,
    public graphic: string,
    public wireless: string,
    public LAN: string,
    public connection: {
      USB: string;
      HDMI_VGA: string;
    },
    public keyboard: string,
    public webcam: string,
    public audio: string,
    public battery: string,
    public OS: string,
    public dimension: string,
    public weight: string,
    public color: Array<string>,
    public security: string,
    public price: number,
    public sale: number,
    public status: boolean,
    public thumbnails: any,
    public interaction: {
      rating_point: number,
      rates: number,
      comments: number
    },
    public blog?: any, 
    public blog_raw?: any
  ) {}
}
