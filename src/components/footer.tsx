import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-[#161616] relative w-full p-5 md:p-10">
      <div className="flex items-center justify-center gap-14 flex-wrap">
        <div className="flex flex-col gap-5 w-[300px]">
          <Image
            src={"/assets/logo.svg"}
            width={116}
            height={154}
            alt="Star Details And Ceramic Logo"
          />
          <div className="text-white">
            Our experts enhance and protect your vehicle’s appearance with top
            -quality products and techniques.
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-14">
          <div className="flex flex-col gap-6">
            <div className="text-[24px] leading-7 font-bold text-white">
              Quick Links
            </div>
            <div className="text-[18px] leading-7 text-white">Home</div>
            <div className="text-[18px] leading-7 text-white">About Us</div>
            <div className="text-[18px] leading-7 text-white">Services</div>
            <div className="text-[18px] leading-7 text-white">
              IGL Ceramic Coating
            </div>
            <div className="text-[18px] leading-7 text-white">Shop</div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="text-[24px] leading-7 font-bold text-white">
              Contact Information
            </div>
            <div className="text-[18px] leading-7 text-white">715-690-9946</div>
            <div className="text-[18px] leading-7 text-white">
              landonw@jttr.net
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="text-[24px] leading-7 font-bold text-white">
              Locate Us
            </div>
            <div className="border border-[#8D8D8D] p-2 bg-white/10 rounded-[15px]">
              <Image
                src={"/assets/map.png"}
                width={374}
                height={221}
                alt="Map Image"
                className="h-[221px] w-[374px] z-30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
