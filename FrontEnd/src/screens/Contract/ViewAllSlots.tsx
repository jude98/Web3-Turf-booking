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
import { readContract } from "@wagmi/core";
import abi from "../../../abi/abi.json";
import {
    CONTRACT_ADDRESS,
    NFT_CONTRACT_ADDRESS,
    NFT_URI,
} from "../constant.ts";
import { Wconfig } from "../index.ts";
import { zeroAddress } from "viem";
import { useState } from "react";
import NFTABI from "../../../abi/nft.json";

export const PrepareReadContract: React.FC = () => {
    const { address } = useAccount();
    const toast = useToast();
    const [isBooking, setIsBooking] = useState<number>(0);

    const { data: totalActiveSlots, refetch: refetchCount }: any =
        useReadContract({
            address: CONTRACT_ADDRESS,
            abi: abi.abi,
            functionName: "totalSlots",
            account: address,
        });

    const { data: allSlotsInfo, refetch: refetchTransaction }: any =
        useReadContract({
            address: CONTRACT_ADDRESS,
            abi: abi.abi,
            functionName: "getAllSlots",
            account: address,
        });

    const { writeContractAsync } = useWriteContract();

    const onBookSlot = async (id: string) => {
        try {
            setIsBooking(Number(id));
            const result: any = await readContract(Wconfig, {
                abi: abi.abi,
                address: CONTRACT_ADDRESS,
                functionName: "getStatus",
                args: [id],
            });

            if (result[0] !== 0) {
                toast({
                    title: "Slot Already Booked.",
                    description: (
                        <Text textAlign='center'>
                            Please find another slot or wait for this slot to be
                            free
                        </Text>
                    ),
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                setIsBooking(0);
                return;
            }
            await writeContractAsync({
                abi: abi.abi,
                address: CONTRACT_ADDRESS,
                functionName: "bookSlot",
                args: [id],
            });

            await writeContractAsync({
                abi: NFTABI.abi,
                address: NFT_CONTRACT_ADDRESS,
                functionName: "mint",
                args: [address, BigInt(id), `${NFT_URI}${id}.png`],
            });
            refetchCount();
            refetchTransaction();

            toast({
                title: "Slot booked successfully",
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
                    Active Slots ({Number(totalActiveSlots) || 0})
                </Heading>
                {totalActiveSlots > 0 && allSlotsInfo?.length ? (
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Slot ID</Th>
                                <Th>Status</Th>
                                <Th>Booking Owner</Th>
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
                                    <Td color='orange'>
                                        {slot.bookingOwner === zeroAddress
                                            ? "Open to book"
                                            : slot.bookingOwner}
                                    </Td>
                                    <Td>{formatDate(slot.bookedAt)}</Td>

                                    <Td>
                                        {slot.status === 0 && (
                                            <Button
                                                variant=''
                                                onClick={() =>
                                                    onBookSlot(slot.slotId)
                                                }
                                                isLoading={
                                                    isBooking ===
                                                    Number(slot.slotId)
                                                }
                                                fontSize='small'
                                                backgroundColor='green.400'
                                                color='black'
                                            >
                                                Book Slot and Mint NFT
                                            </Button>
                                        )}
                                        {slot.status === 1 && (
                                            <Button
                                                pointerEvents='none'
                                                // isDisabled
                                                variant='unstyled'
                                                color='red'
                                            >
                                                Unavailable
                                            </Button>
                                        )}
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

export const ViewAllSlots: React.FC = () => {
    return (
        <>
            <PrepareReadContract></PrepareReadContract>
        </>
    );
};
