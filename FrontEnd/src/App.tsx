import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeScreen } from "@/screens/";
import { CheckOutSlots } from "@/screens/Contract/CheckOut";
import { ViewAllSlots } from "./screens/Contract/ViewAllSlots";
import NavBar from "./components/layout/Navbar";
import ListNft from "./screens/Contract/NFT";

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <NavBar>
                <Routes>
                    <Route path='/' element={<HomeScreen />}></Route>
                    <Route path='/book' element={<ViewAllSlots />}></Route>
                    <Route path='/checkout' element={<CheckOutSlots />}></Route>
                    <Route path='/nft' element={<ListNft />}></Route>
                </Routes>
            </NavBar>
        </BrowserRouter>
    );
};
