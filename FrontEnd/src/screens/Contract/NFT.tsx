import { Flex, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import NFTABI from "../../../abi/nft.json";
import { NFT_CONTRACT_ADDRESS } from "../constant";
import { useAccount, useReadContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { Wconfig } from "..";
import { useEffect, useState } from "react";

const ListNFTs = () => {
    const { address } = useAccount();
    const [allNFTs, setAllNFTs] = useState<string[]>([]);

    const { data: totalNFTs }: any = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFTABI.abi,
        functionName: "balanceOf",
        args: [address],
    });

    const tokenIndexes =
        totalNFTs && Number(totalNFTs)
            ? Array.from({ length: Number(totalNFTs) }, (_, index) => index)
            : [];

    const getAllNFTURLs = async () => {
        const nfts = [];
        for (const tokenIndex of tokenIndexes) {
            const tokenId: BigInt = (await readContract(Wconfig, {
                abi: NFTABI.abi,
                address: NFT_CONTRACT_ADDRESS,
                functionName: "tokenOfOwnerByIndex",
                args: [address, BigInt(tokenIndex)],
            })) as BigInt;
            const tokenURI: string = (await readContract(Wconfig, {
                abi: NFTABI.abi,
                address: NFT_CONTRACT_ADDRESS,
                functionName: "tokenURI",
                args: [tokenId],
            })) as string;
            nfts.push(tokenURI);
        }
        setAllNFTs(nfts);
    };

    useEffect(() => {
        if (totalNFTs && Number(totalNFTs)) {
            getAllNFTURLs();
        }
    }, [totalNFTs]);

    console.log(totalNFTs, "nft");
    return (
        <Flex direction='column' align='center' mt={4}>
            <Heading mb={8} color='white'>
                NFT holdings ({Number(totalNFTs) || 0})
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing='4'>
                {allNFTs.map((nft) => (
                    <Image src={nft} />
                ))}
            </SimpleGrid>
        </Flex>
    );
};

export default ListNFTs;
