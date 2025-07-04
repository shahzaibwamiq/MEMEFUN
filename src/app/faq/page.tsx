"use client";
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import Breadcrum from '@/components/ui/breadcrum/Breadcrum';

const faqs = [
  {
    question: 'What is memes.fun?',
    answer:
      'memes.fun is a gamified platform to create, launch, and trade meme-based cryptocurrencies in a fun, secure, and user-friendly way.',
  },
  {
    question: 'Do I need coding skills to launch a token?',
    answer: 'Nope! You can launch your token in a few clicks without writing a single line of code.',
  },
  {
    question: 'How does the Bonding Curve work?',
    answer:
      "It's a pricing model where token price increases as demand rises. Perfect for fair launches and sustainable growth.",
  },
  {
    question: 'Is launching a token free?',
    answer: "There's a one-time deployment fee of 111 ZIG, which covers setup and security.",
  },
  {
    question: 'Can I customize my token?',
    answer: 'Yes! Choose the name, symbol, image, tokenomics, and sale settings that suit your vision.',
  },
  {
    question: "What's the max a single buyer can purchase?",
    answer: 'You can optionally enable a 7% per-wallet cap to avoid whale domination.',
  },  
  {
    question: 'What wallets can I use?',
    answer: 'memes.fun supports Leap, Keplr, and Cosmostation. Leap is recommended.',
  },
  {
    question: 'Is liquidity locked?',
    answer: 'Yes, liquidity is auto-locked to protect against rug pulls.',
  },
  {
    question: 'What is the AI Token Design Assistant?',
    answer: 'It helps generate your token image, description, and Twitter banner using AI.',
  },
  {
    question: "Can I track my token's performance?",
    answer: 'Yes! Real-time stats on market cap, holders, volume, and staking are available.',
  },
  {
    question: 'How do I earn from referrals?',
    answer: 'Share your referral link and earn ZIG and fee percentages from user actions.',
  },
  {
    question: 'What happens after my token launches?',
    answer: 'Tokens are migrated to Oroswap DEX for further liquidity and trading.',
  },
  {
    question: 'Can I stake my meme coins?',
    answer: 'Yes, staking is available post-migration. Official partners to be announced.',
  },
  {
    question: "What's a rug pull and how do you prevent it?",
    answer: "It's when liquidity is pulled suddenly. We auto-lock liquidity and use fraud alerts.",
  },
  {
    question: 'Can I sell my tokens anytime?',
    answer: 'Absolutely. You can sell anytime and lock in profits.',
  },
  {
    question: 'Is memes.fun beginner-friendly?',
    answer: "Totally! It's built for everyone—from degens to complete newbies.",
  },
  {
    question: 'What is the 111 ZIG liquidity migration fee?',
    answer: "It's required to migrate your token from memes.fun to Oroswap DEX.",
  },
  {
    question: 'How secure is the platform?',
    answer: 'We use contract audits, AI fraud alerts, and secure wallet integrations.',
  },
  {
    question: 'Can I update my token after launch?',
    answer: 'Core settings are locked, but you can track and later rebrand via new tokens.',
  },
  {
    question: 'Where can I get support?',
    answer: 'Contact support via the site, Telegram, or X (Twitter) for assistance.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <>
    <Breadcrum title="FAQ's" />

<section className="reward_sec faq_sec">
  <div className="container">
    <div className="col-12">
      <h2 className="text-center">Frequently Asked Questions</h2>
    </div>
  <div className="space-y-4 col-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="btn_box"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="faq_btn"
              >
                <h3 className="faq_head">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <div className=" faq_ans">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

    </div>
    </section>
    </>
  );
};

export default FAQ;
