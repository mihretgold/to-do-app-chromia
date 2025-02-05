'use client';

import React from 'react';
import detectEthereumProvider from "@metamask/detect-provider";
import {
  Eip1193Provider,
  createKeyStoreInteractor,
  createSingleSigAuthDescriptorRegistration,
  createWeb3ProviderEvmKeyStore,
  hours,
  registerAccount,
  registrationStrategy,
  ttlLoginRule,
  deleteAuthDescriptor,
} from "@chromia/ft4";
import { createClient } from "postchain-client";
import { useSessionContext } from '@/components/ContextProvider';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();
  const { setSession } = useSessionContext();

  const handleLogin = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    const provider = (await detectEthereumProvider()) as unknown as Eip1193Provider;

    if (!provider) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    const accounts = await provider.request({ method: "eth_requestAccounts" });

    const client = await createClient({
      nodeUrlPool: "http://localhost:7740",
      blockchainRid: 'D2215C73F242D307DBE10C0AE58A14425428420DAEB0514ED5669204252B030E',
    });

    const evmKeyStore = await createWeb3ProviderEvmKeyStore(provider);
    const evmKeyStoreInteractor = createKeyStoreInteractor(client, evmKeyStore);
    const chromiaAccounts = await evmKeyStoreInteractor.getAccounts();

    if (chromiaAccounts.length > 0) {
      const { session } = await evmKeyStoreInteractor.login({
        accountId: chromiaAccounts[0].id,
        config: {
          rules: ttlLoginRule(hours(2)),
          flags: ["MySession"],
        },
      });
      setSession(session);
      router.push('/');
    } else {
      const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);

      try {
        const { session } = await registerAccount(
          client,
          evmKeyStore,
          registrationStrategy.open(authDescriptor, {
            config: {
              rules: ttlLoginRule(hours(2)),
              flags: ["MySession"],
            },
          }),
          {
            name: "register_user",
            args: [],
          }
        );
        setSession(session);
        router.push('/');
      } catch (error: any) {
        if (error.message.includes("Max <10> auth descriptor count reached")) {
          for (let i = 0; i < chromiaAccounts.length; i++) {
            await deleteAuthDescriptor(chromiaAccounts[i].id);
          }
          
          const { session } = await registerAccount(
            client,
            evmKeyStore,
            registrationStrategy.open(authDescriptor, {
              config: {
                rules: ttlLoginRule(hours(2)),
                flags: ["MySession"],
              },
            }),
            {
              name: "register_user",
              args: [],
            }
          );
          setSession(session);
          router.push('/');
        } else {
          console.error("Error during registration:", error);
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-indigo-300">
      <div className="text-center px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to the Future of Apps!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Experience the best in blockchain technology with secure, decentralized, and scalable solutions. Connect with MetaMask and access a world of possibilities.
        </p>
        <button
          onClick={handleLogin}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-full shadow-md text-lg font-semibold hover:opacity-90 transition"
        >
          Connect with MetaMask
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
