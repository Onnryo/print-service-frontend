import { generateClasses } from '@formkit/themes'

export default {
  config: {
    classes: generateClasses({
      text: {
        outer: 'p-2 mb-2',
        label: 'block mb-1 font-bold text-base',
        inner: 'flex items-center border rounded-lg mb-1 focus-within:border-blue-500',
        input: 'flex-1 h-10 px-3 border-gray-300 text-base text-gray-700 placeholder-gray-400',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
      },
      email: {
        outer: 'p-2 mb-2',
        label: 'block mb-1 font-bold text-base',
        inner: 'flex items-center border rounded-lg mb-1 focus-within:border-blue-500',
        input: 'flex-1 h-10 px-3 border-gray-300 text-base text-gray-700 placeholder-gray-400',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
      },
      password: {
        outer: 'p-2 mb-2',
        label: 'block mb-1 font-bold text-base',
        inner: 'flex items-center border rounded-lg mb-1 focus-within:border-blue-500',
        input: 'flex-1 h-10 px-3 border-gray-300 text-base text-gray-700 placeholder-gray-400',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
      },
      checkbox: {
        outer: 'p-2 mb-2',
        label: 'flex items-center mb-1 text-base',
        input: 'h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
      },
      radio: {
        outer: 'p-2 mb-2',
        label: 'flex items-center mb-1 text-base',
        input: 'h-4 w-4 border-gray-300 rounded-full text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
      },
      select: {
        outer: 'p-2 mb-2',
        label: 'block mb-1 font-bold text-base',
        inner: 'flex items-center border rounded-lg mb-1 focus-within:border-blue-500',
        input: 'flex-1 h-10 px-3 border-gray-300 text-base text-gray-700 placeholder-gray-400',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
      },
      textarea: {
        outer: 'p-2 mb-2',
        label: 'block mb-1 font-bold text-base',
        inner: 'flex items-center border rounded-lg mb-1 focus-within:border-blue-500',
        input: 'flex-1 px-3 py-2 border-gray-300 text-base text-gray-700 placeholder-gray-400',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
      },
      file: {
        outer: 'p-2 mb-2',
        label: 'block mb-1 font-bold text-base',
        inner: 'flex items-center border rounded-lg mb-1 focus-within:border-blue-500',
        input: 'absolute w-full h-10 px-3 border-gray-300 text-base text-gray-700 placeholder-gray-400 cursor-pointer text-transparent opacity-0 z-[2]',
        help: 'text-sm text-gray-500',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-1 text-sm',
        fileItem: 'flex items-center text-gray-800 mb-1 last:mb-0',
        fileItemIcon: 'w-4 mr-2 shrink-0',
        fileList: 'shrink grow peer px-3 py-2',
        fileName: 'break-all grow text-ellipsis',
        fileRemove: 'relative z-[2] ml-2 text-sm text-blue-500 hover:text-red-500',
        fileRemove: 'relative z-[2] ml-auto text-sm text-blue-500 hover:text-red-500 self-end flex-shrink-0',
        noFiles: 'flex w-full items-center px-3 py-2 text-gray-400',
        noFilesIcon: 'w-4 mr-2',
      },
      submit: {
        outer: 'p-2 mb-2 flex justify-end',
        input: 'py-2 px-4 border border-transparent rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      },
    }),
  },
}