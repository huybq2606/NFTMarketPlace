import type { NextPage } from "next";
import { useRouter } from "next/router";
import datajson from "../../data.json";
import Image from "next/image";

const Detailed: NextPage = () => {
  const router = useRouter();
  const query = router.query;

  const data = datajson.nft.find((nft) => nft.uid === query.uid);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className=" flex flex-row">
        <div className="w-2/3 justify-center flex relative h-96 mr-8">
          <Image
            src={data?.imageURL ?? "https://picsum.photos/500"}
            alt=""
            layout="fill"
          />
        </div>
        <div className="w-1/3">
          <div className="shadow">
            <div className="bg-blue-400 text-white p-4">
              <h1 className="text-xl font-bold">{data?.nftName ?? ""}</h1>
              <p className="text-lg">{data?.creatorName ?? ""}</p>
            </div>
            <div className="bg-white p-4">
              <h2 className="text-lg font-bold mb-4">Asset details</h2>
              <p className="font-semibold">
                Asset Name:{" "}
                <span className="font-normal italic">{data?.nftName}</span>
              </p>
              <p className="font-semibold">
                Asset ID:{" "}
                <span className="font-normal italic">{data?.uid}</span>{" "}
              </p>
              <p className="font-semibold">
                Policy ID:{" "}
                <span className="font-normal italic">{data?.policyID}</span>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailed;
