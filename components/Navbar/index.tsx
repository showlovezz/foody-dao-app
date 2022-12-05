import { useEffect, useState } from 'react';
import { Button, Container, Form, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Axios from 'axios';
import type { NextPage } from 'next';
import { useAccount, useSignMessage } from 'wagmi';

import { fetchUserData } from '../../utilities/duck';

// type SignMessageProps = {
// 	data: string;
// 	signMessage: (message: string) => void | undefined;
// 	signMessageAsync: (message: string) => void | undefined;
// };

const Navbar: NextPage = () => {
	const [userData, setUserData] = useState({
		address: '',
		auth_token: '',
		level: '',
		user_id: '',
	});
	const { address } = useAccount();
	const { data: signatureData, signMessage } = useSignMessage();

	useEffect(() => {
		const fetchData = async () => {
			try {
				await signMessage({ message: 'Login FoodyDao' });
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
			}
		};

		if (address && !signatureData) {
			fetchData();
		}
	}, [address, signMessage, signatureData]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await fetchUserData(address ?? '', signatureData ?? '');
				setUserData({
					address: data.address,
					auth_token: data.auth_token,
					level: data.level,
					user_id: data.user_id,
				});

				localStorage.setItem('dapp_address', data.address);
				localStorage.setItem('dapp_auth_token', data.auth_token);
				localStorage.setItem('dapp_level', data.level);
				localStorage.setItem('dapp_user_id', data.user_id);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
			}
		};

		if (address && signatureData) {
			fetchData();
		}
	}, [address, signatureData]);

	// eslint-disable-next-line no-console
	console.log(userData);

	return (
		<BootstrapNavbar bg='light' fixed='top'>
			<Container fluid>
				<BootstrapNavbar.Brand href='#home'>Foddy Dao</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle />
				<BootstrapNavbar.Collapse className='justify-content-end'>
					<Form className='d-flex me-2'>
						<Form.Control
							type='search'
							placeholder='Search Restaurant'
							className='me-2'
							aria-label='Search'
						/>
						<Button variant='outline-primary'>Search</Button>
					</Form>
					<ConnectButton />
					<Button variant='outline-success'>Sign In</Button>
				</BootstrapNavbar.Collapse>
			</Container>
		</BootstrapNavbar>
	);
};

export default Navbar;
// typeof signatureData === 'undefined'
