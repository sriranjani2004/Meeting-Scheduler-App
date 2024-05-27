"use client";
import React, { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { collection, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from '@/config/FirebaseConfig';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { toast } from 'sonner';
import DaysList from '@/app/_utils/DaysList';

function Availability() {
    const [availabilityData, setAvailabilityData] = useState({
        daysAvailable: {}, // Initialize daysAvailable as an empty object
        startTime: '',
        endTime: ''
    });
    const db = getFirestore(app);
    const { user } = useKindeBrowserClient();

    useEffect(() => {
        user && getBusinessInfo();
    }, [user]);

    const getBusinessInfo = async () => {
        const docRef = doc(db, 'Business', user?.email);
        const docSnap = await getDoc(docRef);
        const result = docSnap.data();
        setAvailabilityData({
            daysAvailable: result?.daysAvailable || {}, // Update daysAvailable with the retrieved value or keep it as an empty object
            startTime: result?.startTime || '',
            endTime: result?.endTime || ''
        });
    };

    const onHandleChange = (day, value) => {
        setAvailabilityData({
            ...availabilityData,
            daysAvailable: {
                ...availabilityData.daysAvailable,
                [day]: value
            }
        });
    };

    const handleSave = async () => {
        console.log(availabilityData, startTime, endTime);
        const docRef = doc(db, 'Business', user?.email);
        await updateDoc(docRef, {
            daysAvailable: availabilityData.daysAvailable,
            startTime: startTime,
            endTime: endTime
        }).then(resp => {
            toast('Change Updated !');
        });
    };

    return (
        <div className='p-10'>
            <h2 className='font-bold text-2xl'>Availability</h2>
            <hr className='my-7' />
            <div>
                <h2 className='font-bold'>Availability Days</h2>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-5 my-3'>
                    {DaysList.map((item, index) => (
                        <div key={index}>
                            <h2><Checkbox
                                checked={availabilityData.daysAvailable[item?.day] || false}
                                onCheckedChange={(e) => onHandleChange(item.day, e)}
                            /> {item.day}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className='font-bold mt-10'>Availability Time</h2>
                <div className='flex gap-10'>
                    <div className='mt-3'>
                        <h2>Start Time</h2>
                        <Input type="time"
                            defaultValue={availabilityData.startTime}
                            onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div className='mt-3'>
                        <h2>End Time</h2>
                        <Input type="time"
                            defaultValue={availabilityData.endTime}
                            onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                </div>
            </div>
            <Button className="mt-10"
                onClick={handleSave}
            >Save</Button>
        </div>
    );
}

export default Availability;
