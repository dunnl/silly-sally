FROM haskell:8

COPY . /haskell 

WORKDIR /haskell

RUN stack build

CMD ["stack","exec","sillysally-exe"]