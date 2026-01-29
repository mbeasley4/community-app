import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function CompleteRegistration({ token }: { token: string }) {
  const { data, setData, post, processing, errors } = useForm({
    token,
    name: '',
    password: '',
    password_confirmation: '',
    avatar: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/complete-registration', {
      forceFormData: true, // required for file uploads
    });
  }

  function handleFile(file: File) {
    setData('avatar', file);
    setPreview(URL.createObjectURL(file));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">

        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Complete Your Registration
        </h1>

        <form onSubmit={submit} className="space-y-5">

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>

            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInput.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition"
            >
              {preview ? (
                <img
                  src={preview}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Drag & drop image here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    or click to browse
                  </p>
                </>
              )}

              <input
                type="file"
                ref={fileInput}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {errors.avatar && (
              <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <input
              className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Full name"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Password"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm */}
          <div>
            <input
              type="password"
              className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Confirm Password"
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
            />
          </div>

          {/* Token Error */}
          {errors.token && (
            <p className="text-sm text-red-500 text-center">
              {errors.token}
            </p>
          )}

          {/* Submit */}
          <button
            disabled={processing}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {processing ? 'Setting up...' : 'Finish Setup'}
          </button>

        </form>
      </div>
    </div>
  );
}
