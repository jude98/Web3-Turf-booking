import {
    http,
    createConfig,
    useAccount,
    useConnect,
    useDisconnect,
} from "wagmi";

import {
    Flex,
    Button,
    Box,
    Text,
    Heading,
    HStack,
    Image,
    Center,
} from "@chakra-ui/react";

import { arbitrumSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { ARBITRUM_RPC } from "../constant";

export const Wconfig = createConfig({
    chains: [arbitrumSepolia],
    connectors: [metaMask()],
    transports: {
        [arbitrumSepolia.id]: http(ARBITRUM_RPC),
    },
});

export const HomeScreen: React.FC = () => {
    return <Profile />;
};

export function Profile() {
    const { address, connector, isConnected } = useAccount();

    // const { data: ensName } = useEnsName({ address });
    const { connect, connectors, error, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    return (
        <Flex
            minHeight='70vh'
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
        >
            {isConnected ? (
                <Center h='100vh' flexDirection='column'>
                    <Box
                        p={8}
                        maxW='lg'
                        borderWidth={1}
                        borderRadius='md'
                        boxShadow='lg'
                        bg='transparent'
                        textAlign='center'
                    >
                        <Heading as='h1' size='2xl' mb={4}>
                            Welcome to Turf Booking
                        </Heading>
                        <Text mb={8} color='green.100'>
                            Book your favorite turf spaces hassle-free with our
                            blockchain-powered platform.
                        </Text>
                        <Box bg='gray.900' p={4} borderRadius='md' mb={4}>
                            <Text fontWeight='bold' mb={4} color='green.400'>
                                Connected Wallet:
                            </Text>
                            <Text mb={2} color='orange.300'>
                                {address}
                            </Text>
                            <Button
                                backgroundColor='green.900'
                                onClick={() => disconnect()}
                            >
                                <HStack spacing={2}>
                                    <Image
                                        src={connector?.icon}
                                        alt={connector?.name}
                                        boxSize={8}
                                    />
                                    <Text>Disconnect Wallet</Text>
                                </HStack>
                            </Button>
                        </Box>
                        <Text
                            fontSize='sm'
                            color='green.400'
                            fontWeight='700'
                            opacity='0.6'
                        >
                            Stay connected and enjoy turf booking!
                        </Text>
                    </Box>
                    <Box
                        maxW='3xl'
                        mt={10}
                        textAlign='center'
                        color='green.100'
                    >
                        <Text>
                            Welcome to our Turf Booking DApp! Harnessing the
                            power of blockchain technology, our platform
                            revolutionizes the way you book sports facilities.
                            With transparent, secure transactions and
                            decentralized ownership records, you can confidently
                            reserve your favorite turf spaces hassle-free.
                            Experience seamless booking, real-time availability,
                            and trust in every transaction. Join us and elevate
                            your sports booking experience today!
                        </Text>
                    </Box>
                </Center>
            ) : (
                <Flex direction='column' alignItems='center'>
                    <Heading mt={4} mb={4}>
                        Turf Slot Booking
                    </Heading>
                    <Text
                        mt={4}
                        mb={2}
                        fontSize='large'
                        textAlign='center'
                        fontFamily='heading'
                    >
                        Find and book your nearest turf just a click away 🚀
                    </Text>
                    <Box
                        mt={4}
                        p={4}
                        borderWidth='1px'
                        borderRadius='lg'
                        textAlign='center'
                        backgroundColor='green.900'
                    >
                        {connectors.map((connector) =>
                            connector.id === "io.metamask" ? (
                                <Button
                                    key={connector.id}
                                    onClick={() => connect({ connector })}
                                    mt={2}
                                    backgroundColor='green.900'
                                    size='lg'
                                    borderRadius='full'
                                    px={8}
                                    isLoading={isPending}
                                >
                                    <HStack spacing={2}>
                                        <Image
                                            src={connector.icon}
                                            alt={connector.name}
                                            boxSize={8}
                                        />
                                        <Text>Connect with Metamask</Text>
                                    </HStack>
                                </Button>
                            ) : null
                        )}
                    </Box>
                </Flex>
            )}

            {error && (
                <Box
                    mt={4}
                    p={4}
                    bg='red.100'
                    color='red.800'
                    borderWidth='1px'
                    borderRadius='lg'
                >
                    {error.message}
                </Box>
            )}
        </Flex>
    );
}
