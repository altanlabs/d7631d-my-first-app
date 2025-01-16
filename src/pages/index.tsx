import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const IndexPage = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetch("https://api.coincap.io/v2/assets")
      .then((response) => response.json())
      .then((data) => setAssets(data.data));
  }, []);

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  const chartData = {
    labels: selectedAsset?.history.map((entry) => entry.date) || [],
    datasets: [
      {
        label: "Price",
        data: selectedAsset?.history.map((entry) => entry.priceUsd) || [],
        fill: false,
        backgroundColor: "#f87171",
        borderColor: "#f87171"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-16 space-y-32">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Badge variant="secondary" className="mb-4">
          Welcome to Your Crypto Dashboard
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Track Your Crypto Assets
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Click on an asset to view details and price development.
        </p>
      </motion.section>

      {/* Assets Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-3"
      >
        {assets.map((asset) => (
          <motion.div key={asset.id} variants={fadeInUp} onClick={() => handleAssetClick(asset)}>
            <Card className="cursor-pointer">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-primary font-bold">{asset.symbol}</span>
                </div>
                <h3 className="text-xl font-bold">{asset.name}</h3>
                <p className="text-muted-foreground">
                  Market Cap: ${parseFloat(asset.marketCapUsd).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Asset Details Section */}
      {selectedAsset && (
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {selectedAsset.name} Details
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Price development over time.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="p-4">
            <Line data={chartData} />
          </motion.div>
        </motion.section>
      )}
    </div>
  );
};

export default IndexPage;
