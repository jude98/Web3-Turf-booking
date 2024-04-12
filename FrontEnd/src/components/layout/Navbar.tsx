import React from "react";
import { Link } from "react-router-dom";
import { FaEthereum } from "react-icons/fa";
import { useAccount } from "wagmi";

import {
    CloseButton,
    Icon,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Flex,
    Box,
    Heading,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { TbPlayFootball } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { SiBlockchaindotcom } from "react-icons/si";

interface LinkItemProps {
    name: string;
    icon: IconType;
    url: string;
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: React.ReactNode;
    url: string;
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Connect Wallet", icon: FaEthereum, url: "/" },
    { name: "Book slot", icon: TbPlayFootball, url: "/book" },
    { name: "Checkout Slot", icon: IoBagCheckOutline, url: "/checkout" },
    { name: "NFT", icon: SiBlockchaindotcom, url: "/nft" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const { isConnected, address } = useAccount();
    return (
        <Box
            transition='1s ease'
            bg='green.900'
            borderRight='1px'
            borderRightColor='gray.700'
            w={{ base: "full", md: 60 }}
            pos='fixed'
            h='full'
            {...rest}
        >
            <Flex direction='column' justifyContent='space-between' h='full'>
                <Box>
                    <Flex
                        h='20'
                        alignItems='center'
                        mx='8'
                        justifyContent='space-between'
                    >
                        <Heading as='h2' size='md' fontWeight='bold'>
                            TURF BOOKING
                        </Heading>
                        <CloseButton
                            display={{ base: "flex", md: "none" }}
                            onClick={onClose}
                        />
                    </Flex>
                    {LinkItems.map((link) => (
                        <NavItem
                            key={link.name}
                            icon={link.icon}
                            url={link.url}
                        >
                            <Link to={link.url}>{link.name}</Link>
                        </NavItem>
                    ))}
                </Box>
                <Box m='8' pb='4'>
                    <Heading as='h4' size='sm' fontWeight='bold' mb='2'>
                        Connected Account
                    </Heading>
                    <Box
                        style={{
                            color: isConnected && address ? "orange" : "red",
                            fontStyle:
                                isConnected && address ? "normal" : "italic",
                            marginLeft: "40px",
                        }}
                    >
                        {isConnected && address
                            ? `${address.substring(0, 3)}...${address.substring(
                                  address.length - 3
                              )}`
                            : "Not connected"}
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

const NavItem = ({ icon, children, url, ...rest }: NavItemProps) => {
    return (
        <Box
            as={Link}
            // href='#'
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
            to={url}
        >
            <Flex
                align='center'
                p='4'
                mx='4'
                borderRadius='lg'
                role='group'
                cursor='pointer'
                _hover={{
                    bg: "cyan.400",
                    color: "white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr='4'
                        boxSize='6'
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    );
};

const NavBar = ({ children }: any) => {
    const { isOpen, onClose } = useDisclosure();

    return (
        <Box minH='100vh'>
            <SidebarContent onClose={() => onClose} display='block' />
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size='full'
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <Box
                ml={{ base: 0, md: 60 }}
                minH='100vh'
                p='4'
                backgroundImage="url('https://source.unsplash.com/group-of-people-playing-soccer-on-soccer-field-8-s5QuUBtyM')"
                bgRepeat='no-repeat'
                bgSize='cover'
            >
                {children}
            </Box>
        </Box>
    );
};

export default NavBar;
