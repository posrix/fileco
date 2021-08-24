import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

const BaseWordMixin = css`
  padding: 6px 12px;
  border-radius: 3px;
  font-size: 16px;
  font-weight: bolder;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const WordButton = styled.div`
  ${BaseWordMixin}
  justify-content: center;
  color: #212121;
  font-weight: 600;
  border: 1px solid #bdbdbd;
  font-size: 14px;
  background-color: #fff;
`;

export const SortedWordButton = styled.div`
  ${BaseWordMixin}
  justify-content: space-around;
  color: #757575;
  border: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 14px;
  background-color: #fff;
`;

export const WordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const SortedWordsContainer = styled.div<{ hasWords: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: ${(props) => (props.hasWords ? '20px 0' : '8px 0')};
`;
