module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors:{
        primary: '#61DAFB',
        mainColor: '#F5F5F5'
      },
      fontFamily:{
        body: 'Inter'
      },
      marker: {
        fact: {
          color:'#61DAFB',
          fontSize:'1.4rem'
        }
      }
    },
  },
  plugins: [],
}
