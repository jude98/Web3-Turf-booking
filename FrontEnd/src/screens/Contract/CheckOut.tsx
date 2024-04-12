import {
    Flex,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    useToast,
    Button,
    Heading,
} from "@chakra-ui/react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import abi from ".../../../abi/abi.json";
import NFTABI from "../../../abi/nft.json";
import { CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from "../constant.ts";
import { useState } from "react";

export const PrepareReadContract: React.FC = () => {
    const { address } = useAccount();
    const toast = useToast();
    const [isBooking, setIsBooking] = useState<number>(0);

    const { data: allSlotsInfo, refetch: refetchTransaction }: any =
        useReadContract({
            address: CONTRACT_ADDRESS,
            abi: abi.abi,
            functionName: "getSlotsByUser",
            account: address,
        });

    const { writeContractAsync } = useWriteContract();

    const onCheckOutSlot = async (id: string) => {
        try {
            setIsBooking(Number(id));
            await writeContractAsync({
                abi: abi.abi,
                address: CONTRACT_ADDRESS,
                functionName: "checkOut",
                args: [id],
            });
            await writeContractAsync({
                abi: NFTABI.abi,
                address: NFT_CONTRACT_ADDRESS,
                functionName: "burn",
                args: [BigInt(id)],
            });
            refetchTransaction();

            toast({
                title: "Slot checkedout successfully",
                description: (
                    <Text>
                        Your transaction has been successfully executed.
                    </Text>
                ),
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setIsBooking(0);
        } catch (err) {
            setIsBooking(0);
        }
    };

    const formatDate = (timestamp: string) => {
        if (!parseInt(timestamp, 10)) return "";
        const date = new Date(parseInt(timestamp, 10) * 1000);
        console.log(date);

        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        const second = String(date.getSeconds()).padStart(2, "0");

        const formattedDateTime = `${month}/${day}/${year} ${hour}:${minute}:${second}`;

        return formattedDateTime;
    };

    return (
        <>
            <Flex direction='column' align='center' mt={4}>
                <Heading mb={8} color='white'>
                    Booked by me (
                    {allSlotsInfo?.length ? allSlotsInfo.length : 0})
                </Heading>
                {allSlotsInfo?.length ? (
                    <Table variant='simple'>
                        <Thead color='gray.400'>
                            <Tr>
                                <Th>Slot ID</Th>
                                <Th>Status</Th>
                                <Th>Booked At</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {allSlotsInfo.map((slot: any) => (
                                <Tr key={slot.slotId}>
                                    <Td>{Number(slot.slotId)}</Td>
                                    <Td
                                        color={
                                            slot.status === 0
                                                ? "green.400"
                                                : "red"
                                        }
                                    >
                                        {slot.status === 0 ? "Open" : "Booked"}
                                    </Td>
                                    <Td>{formatDate(slot.bookedAt)}</Td>

                                    <Td>
                                        <Button
                                            variant=''
                                            onClick={() =>
                                                onCheckOutSlot(slot.slotId)
                                            }
                                            isLoading={
                                                isBooking ===
                                                Number(slot.slotId)
                                            }
                                            backgroundColor='green.400'
                                            fontSize='small'
                                            color='black'
                                        >
                                            Checkout slot and burn NFT
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                ) : (
                    <Text mt={4}>No active slots.</Text>
                )}
            </Flex>
        </>
    );
};

export const CheckOutSlots: React.FC = () => {
    return (
        <>
            <PrepareReadContract></PrepareReadContract>
        </>
    );
};
