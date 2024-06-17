// src/app/profile/page.jsx
"use client"
import ProfileDetails from "@/components/profile/ProfileDetails";
import { useAtom } from "jotai";
import Link from "next/link";
import {  useEffect, useState } from "react";
import { profileIdAtom } from "../../../store";
import { TrashIcon } from '@heroicons/react/24/solid';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/navigation";

const fetchProfileData = async (id) => {
  try {
    const res = await fetch(`http://localhost:8080/profile/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile data: ', error);
    return null;
  }
};

const handleDeleteProfile = async (id, resetId) => {
  try {
    const res = await fetch(`http://localhost:8080/profile/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete profile with id: ${id}`);
    }
    const resData = await res.json();
    resetId('66575f452e46d5e14258c321');    // TODO: this is hardcoded for example (app functionality would delete the whole user and log you out)
    return resData;
  } catch (error) {
    console.error('Error deleting profile: ', error);
    return null;
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useAtom(profileIdAtom);   // use shared profile id state
  const [open, setOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      const profileData = await fetchProfileData(profileId);
      setProfile(profileData);
      setLoading(false);
    };
    fetchData();
  }, [profileId]);

  return (
    // the height is calculated by the responsive viewport height minus the height of the navbar (80px)
    <div className="container mx-auto px-4 h-[calc(100vh-80px)]"> 
      {loading ? (
        <p>Loading profile...</p>   // wait until we fetch the profile
      ) : (
        <div className="flex flex-col h-full justify-between">
          <ProfileDetails profile={profile}/>
          <div className="flex justify-between gap-2 mb-2">
            <Link href={`profile/edit/${profile._id}`} className="bg-blue-500 text-white p-2 rounded">
              Edit Profile
            </Link>
            <button type="button" className="bg-red-500 text-white p-2 rounded" onClick={() => setOpen(true)}>
              <TrashIcon className="size-6"/>
            </button>
          </div>

          {/* Confirmation dialog follows below: (shown on trash button click) */}
          <Transition show={open}>
            <Dialog className="relative z-10" onClose={setOpen}>
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </TransitionChild>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                              Delete Profile
                            </DialogTitle>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you want to delete your profile? All of your data will be permanently
                                removed. This action cannot be undone.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                          onClick={() => {
                            console.log('delete the profile and redirect to login/register page');
                            handleDeleteProfile(profile._id, setProfileId);
                            router.push('/login');
                            setOpen(false);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => setOpen(false)}
                          data-autofocus
                        >
                          Cancel
                        </button>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
          {/* end of confirmation dialog */}

        </div>
      )}
    </div>
  );
};

export default ProfilePage;
