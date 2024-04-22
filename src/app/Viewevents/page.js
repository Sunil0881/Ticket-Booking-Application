"use client"
import { BuyTicket, getAllEvents } from '@/config/Services';
import React, { useEffect, useState } from 'react';

const ViewEvents = () => {
    const [ipfs, setIpfs] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchDataFromIPFS = async () => {
            if (ipfs.length === 0) {
                return;
            }

            const fetchedEvents = [];

            for (let i = 0; i < ipfs.length; i++) {
                const response = await fetch(`https://ipfs.io/ipfs/${ipfs[i].ipfsHash}`);
                const eventData = await response.json();

                const event = {
                    id: parseInt(ipfs[i].id),
                    title: eventData.title,
                    date: eventData.Date,
                    time: eventData.time,
                    location: eventData.location,
                    description: eventData.description,
                    prize: eventData.ticketPrice,
                    totalTickets : eventData.totalTickets,
                    imageUrl: eventData.eventImage,
                    buttonText:" Buy Tickets"
                  };
                fetchedEvents.push(event);
            }

            setEvents(fetchedEvents);
        };

        fetchDataFromIPFS();
    }, [ipfs]);

    useEffect(() => {
        const getEvents = async () => {
            const result = await getAllEvents();
            setIpfs(result);
        };
        getEvents();
    }, []);

    console.log("Data", ipfs);
    console.log("Ipfs", events);

    const BuyTicketFun = async (eventId, tokenUri, ticketPrice) => {
        // console.log("EventID", eventId, "TokenUri", tokenUri, "Ticket Price", price);
        const result = await BuyTicket(eventId, tokenUri, ticketPrice);
        console.log("Result", result);
    }

    return (
        <div>
            <div>ViewEvents</div>
            <div>The Events are:</div>
            <div className="grid grid-cols-3">
            {events.map((event) => (
                <div key={event.id} className="w-[50%]">
                    <div>
                        <img src={event.imageUrl} alt="Event" />
                    </div>
                    <div>Title: {event.title}</div>
                    <div>Date: {event.date}</div>
                    <div>Time: {event.time}</div>
                    <div>Location: {event.location}</div>
                    <div>Description: {event.description}</div>
                    <div>Prize: {event.prize}</div>
                    <div>Total Tickets: {event.totalTickets}</div>
                    <button className=' text-black font-semibold bg-white rounded-lg py-1 px-2' onClick={() => {BuyTicketFun(event.id, event.title, event.prize)}}>
                        {event.buttonText}
                    </button>
                </div>
            ))}
            </div>
        </div>
    );
};

export default ViewEvents;
