import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Background from "./components/background/Background";
import ForegroundContainer from "./components/foreground/ForegroundContainer";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

import GraffitiTicker from "./components/GraffitiTicker";
import CurrentConfig from "./config";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<BrowserRouter>
		<Suspense fallback={null}>
			<Background>
				{/* Nested within background such that we recieve foreground mouse events. */}
				<DynamicContextProvider
					settings={{
						initialAuthenticationMode: "connect-only",
						evmNetworks: CurrentConfig.Chains.map(({ Chain }) => ({
							chainId: Chain.id,
							vanityName: Chain.name,
							chainName: Chain.network,
							networkId: Chain.id,
							nativeCurrency: Chain.nativeCurrency ?? {
								name: "",
								symbol: "",
								decimals: 0,
							},
							rpcUrls: Object.values(Chain.rpcUrls).flatMap(url => url.http),
						})),
						environmentId: "1a5bc82b-cca0-497e-9481-036d5821e14e",
					}}
				>
					<DynamicWagmiConnector>
						<ForegroundContainer />
						{CurrentConfig.ShowGraffiti ? <GraffitiTicker /> : ""}
					</DynamicWagmiConnector>
				</DynamicContextProvider>
			</Background>
		</Suspense>
	</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
