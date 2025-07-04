'use client';

import { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic';
import htmlToDraft from 'html-to-draftjs';
import { FaBan, FaCheck, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { usePopup } from "@/providers/PopupProvider";
import Loader from "@/components/ui/common/Loader";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="text-white">Loading editor...</div>
});

interface profileData {
  email: string;
  emailVerified: boolean
  name: string;
  description: string;
  short_description: string;
  website: string;
  twitter: string;
  telegram: string;
  profile_pic: string;
}
interface UpdateProfileModalProps {
  profileData: profileData;
  ApiUrl?: string;
  token?: string | null;
  onProfileUpdated?: () => void;
}
export default function UpdateProfileModal({ profileData, ApiUrl, token, onProfileUpdated }: UpdateProfileModalProps) {
  const [descWordCount, setDescWordCount] = useState(0);
  const [descError, setDescError] = useState('');
  const [shortDescError, setShortDescError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isOpen, setIsOpen] = useState(false);
  // const [description, setDescription] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    email_verified: false,
    shortDescription: '',
    website: '',
    twitter: '',
    telegram: '',
    image: null as File | null
  });
  const toggleModal = () => setIsOpen(!isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const blocksFromHtml = htmlToDraft(profileData.description || '');
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorStateInit = EditorState.createWithContent(contentState);
    setEditorState(editorStateInit);
    setFormData({
      name: profileData.name,
      email: profileData.email,
      email_verified: profileData.emailVerified,
      shortDescription: profileData.short_description,
      website: profileData.website,
      twitter: profileData.twitter,
      telegram: profileData.telegram,
      image: null // or use profileData.profile_pic in preview separately
    });
  }, [profileData]);
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setFormData({ ...formData, image: files?.[0] || null });
    } else if (name === 'email') {
      // If user changes the email, mark as unverified until save
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        email_verified: value === profileData.email ? prev.email_verified : false
      }));
    } else if (name === 'shortDescription') {
      const characterCount = value.replace(/\s/g, '').length;
      if (characterCount > 200) {
        setShortDescError('Short Description must not exceed 200 characters.');
      } else {
        setShortDescError('');
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setLoading(true);
    try {
      const response = await axios.put(`${ApiUrl}/user/update-profile`,
        {
          name: formData.name,
          email: formData.email,
          shortdescription: formData.shortDescription,
          description: html,
          website: formData.website,
          twitter: formData.twitter,
          telegram: formData.telegram,

        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
      if (response.status === 200) {
        const { emailVerified } = response.data;

        setFormData((prev) => ({
          ...prev,
          email_verified: emailVerified,
        }));
        showPopup('Profile updated successfully', 'success')
        toggleModal();
        if (onProfileUpdated) onProfileUpdated();
      }
    } catch (e: unknown) {
      let errorMessage = 'An unknown error occurred';

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.message || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      showPopup(errorMessage, 'error');
    } finally {
      setLoading(false);
    }


  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="bg-blue-600 text-white px-4 py-2"
      >
        <i className="fa-solid fa-pencil"></i>
      </button>

      {isOpen && (
        <div className="fixed report_modal update_profile_modal inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center position-fixed filter_modal report_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className=" update_input rounded-lg shadow-xl  w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            {loading && <Loader name={'Updating Profile...'} fixed={true} />}
            {/* <DropAnimation /> */}
            <button
              onClick={toggleModal}
              className="close_btn"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="text-xl font-semibold mb-6">Update Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4 row">
              <div className="col-6">
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  defaultValue={formData.name}
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-6">
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={formData.email}
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleInputChange}
                />
                {!formData.email ? (
                  <span className="email_unverified text-red-600 flex items-center gap-2 mt-1">
                    <FaBan />
                    No email found
                  </span>
                ) : formData.email_verified ? (
                  <span className="Email_verified text-green-600 flex items-center gap-2 mt-1">
                    <FaCheck />
                    Verified
                  </span>
                ) : (
                  <span className="email_unverified text-red-600 flex items-center gap-2 mt-1">
                    <FaTimesCircle />
                    Email not verified
                  </span>
                )}

              </div>
              <div className="col-6">
                <label className="block mb-2 font-medium">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  placeholder="Short Description"
                  value={formData.shortDescription}
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Characters: {(formData.shortDescription ?? '').replace(/\s/g, '').length}/200
                </p>
                {shortDescError && <p className="text-red-500 text-sm">{shortDescError}</p>}
              </div>
              <div className="col-6">
                <label className="block mb-2 font-medium">Website</label>
                <input
                  type="url"
                  name="website"
                  placeholder="Website"
                  defaultValue={formData.website}
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-6">
                <label className="block mb-2 font-medium">Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  defaultValue={formData.twitter}
                  placeholder="Twitter"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-6">
                <label className="block mb-2 font-medium">Telegram</label>
                <input
                  type="url"
                  name="telegram"
                  defaultValue={formData.telegram}
                  placeholder="Telegram"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handleInputChange}
                />

              </div>
              <div className="col-12">

                <label className="block mb-2 font-medium">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  className="w-full"
                  accept=".jpeg,.jpg,.png,.jfif,.gif"
                  onChange={handleInputChange}
                />

                <label className="block mb-2 font-medium">Description</label>
                {mounted && (
                  <>
                    <div className="border rounded bg-white text-dark">
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={(editorState) => {
                          const plainText = editorState.getCurrentContent().getPlainText();
                          const charCount = plainText.replace(/\s/g, '').length;

                          setEditorState(editorState);
                          setDescWordCount(charCount);

                          if (charCount > 5000) {
                            setDescError('Description must not exceed 5000 characters.');
                          } else {
                            setDescError('');
                          }
                        }}
                        toolbar={{
                          options: ['inline', 'list', 'history'], // ← link hata diya
                          inline: { options: ['bold', 'italic', 'underline'] },
                        }}
                        wrapperClassName="editor-wrapper"
                        editorClassName="form-control border-0"
                        toolbarClassName="border-bottom px-2"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Characters: {descWordCount}/5000
                    </p>
                    {descError && <p className="text-red-500 text-sm">{descError}</p>}
                  </>
                )}
                <button
                  type="submit"
                  className={`theme_btn my-2 mt-2 ${descWordCount > 2000 || shortDescError ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={descWordCount > 2000 || !!shortDescError || !!descError}
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
