import { getServicePrices } from "@/services/settings/price";
import React, { useEffect, useState } from "react";

interface Service {
  id: number;
  name: string;
  code: string;
  prices: Price[];
}

interface Price {
  weight: number;
  price: number;
  weight_text?: string;
  name?: string;
}

const Prices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState({ service: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await getServicePrices();
        setServices(response.services);
        if (response.services.length > 0) {
          setFilter({ service: response.services[0].id });
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const switchServiceHandle = (id: number) => {
    setFilter({ service: id });
  };

  const getPrices = (): Price[] => {
    const service = services.find((s) => s.id === filter.service);
    if (!service) return [];
    const prices = [...service.prices].sort((a, b) => a.weight - b.weight);
    for (let i = 0; i < prices.length; i++) {
      const preWeight = i > 0 ? prices[i - 1].weight || 0 : 0;
      const weight = prices[i].weight || 0;
      prices[i].weight_text = i === 0 ? `<${weight}` : `${preWeight}-${weight}`;
      prices[i].name = service.name;
    }

    if (hasServiceFBA()) {
      prices.shift();
    }

    return prices;
  };

  const hasServiceFBA = (): boolean => {
    return services.some(
      (s) => s.id === filter.service && s.code.toUpperCase() === "FBA"
    );
  };

  const prices = getPrices();

  return (
    <div className="pages mt-5">
      <div className="container mx-auto">
        <div className="flex t-services mb-5 flex-wrap">
          {services.map((service) => (
            <button
              key={service.id}
              className={`btn rounded-lg py-2 px-5 font-bold text-sm h-11 ml-[15px] ${service.id === filter.service ? "active bg-[#8D181B] text-[#fff] border border-[#8D181B]" : "border border-[#ddd]"}`}
              disabled={!service.prices || !service.prices.length}
              onClick={() => switchServiceHandle(service.id)}
            >
              {service.name === "Saver" ? "Standard" : service.name}
            </button>
          ))}
        </div>
        <div className="page-content mb-12">
          <div className="card pb-5">
            <div className="card-body">
              {isLoading ? (
                <div>Loading...</div>
              ) : prices.length ? (
                <div className="table-responsive">
                  <table className="table-auto w-full text-left border-collapse">
                    <thead>
                      <tr className="">
                        <th className="border-b py-2 px-4">DỊCH VỤ</th>
                        <th className="border-b py-2 px-4">CÂN NẶNG (GRAM)</th>
                        <th className="border-b py-2 px-4">
                          {hasServiceFBA() ? "GIÁ/KG" : "GIÁ"} ($)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-100">
                          <td className="border-b py-2 px-4">
                            {item.name === "Saver" ? "Standard" : item.name}
                          </td>
                          <td className="border-b py-2 px-4">
                            {item.weight_text}
                          </td>
                          <td className="border-b py-2 px-4">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>No prices available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prices;
