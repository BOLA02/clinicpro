import { Link } from "react-router-dom";

export const servicesList = [
  {
    title: "Prescription Drugs Dispensing",
    description: "Convenient Prescription Dispensing Services at Lakeshore gimli medical clinic",
    img: "/Rectangle 7.png",
  },
  {
    title: "Medication Review",
    description: "Optimize Your Health with Medication Review at Lakeshore gimli medical clinic",
    img: "/Rectangle 7 (4).png",
  },
  {
    title: "Over-the-Counter Medications",
    description: "Discover a Wide Range of Over-the-Counter Medications at Lakeshore gimli medical clinic",
    img: "/Rectangle 7 (1).png",
  },
  {
    title: "Unit-dosage Packaging",
    description: "Convenient and Reliable Unit-Dosage Packaging at Lakeshore gimli medical clinic",
    img: "/Rectangle 7 (3).png",
  },
  {
    title: "Vaccinations and Injections of Medications",
    description: "Comprehensive Vaccinations and Injection Services at Lakeshore gimli medical clinic",
    img: "/Rectangle 7 (2).png",
  },
  {
    title: "Free City-Wide Delivery",
    description: "Convenient and Reliable Free City-Wide Delivery from Lakeshore gimli medical clinic",
    img: "/Rectangle 7 (5).png",
  },
];

export const Services = () => {
  return (
    <>
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
            <h2 className="text-center md:text-left text-2xl md:text-3xl font-semibold">
              Our Medical Services
            </h2>
            <div className="text-center md:text-right">
              <p className="text-sm mb-2 md:mb-0">
                We provide a full range of medical services - <br /> 
                from consultation to diagnosis and treatment
              </p>
              <a href="/login" className="text-sm text-[#2f80ed]">
                See all services
              </a>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesList.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md flex flex-col"
              >
                <div className="w-full h-40 sm:h-44 rounded-md overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold mt-3">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1 flex-1">{item.description}</p>
                <button className="text-blue-600 text-sm mt-3 self-start">Read more</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-4">
        <div className="bg-[#d5e6fb] rounded-lg flex flex-col-reverse lg:flex-row items-center gap-6 p-6 lg:p-10">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Visit Clinic Pro today and experience the difference!
            </h2>
            <p className="text-sm mb-4">
              Join over 4,000+ startups already growing with Untitled.
            </p>
            <Link
              to="/login"
              className="bg-[#0ea5e9] text-white px-6 py-2 rounded-lg shadow hover:bg-[#0284c7] transition"
            >
              Get in touch
            </Link>
          </div>

          {/* Image */}
          <div className="flex-1 w-full max-w-xs lg:max-w-full">
            <img
              src="/patient.png"
              alt="Patient illustration"
              className="w-full h-auto mx-auto lg:mx-0"
            />
          </div>
        </div>
      </section>
    </>
  );
};
