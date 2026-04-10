import "@testing-library/jest-dom";

jest.mock("axios", () => {
  const axiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  const axiosMock = {
    create: jest.fn(() => axiosInstance),
  };

  return {
    __esModule: true,
    default: axiosMock,
    ...axiosMock,
  };
});

window.matchMedia =
  window.matchMedia ||
  function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    };
  };

HTMLCanvasElement.prototype.getContext = function getContext() {
  return {};
};
