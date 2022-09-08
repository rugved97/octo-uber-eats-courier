import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { backgroundColor: 'lightblue', flex: 1 },
  handleIndicator: { backgroundColor: 'grey', width: 100 },
  handleIndicatorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  routeDetailsText: { fontSize: 20, letterSpacing: 0.1 },
  deliveryDetailsContainer: { paddingHorizontal: 20 },
  restaurantName: { fontSize: 25, letterSpacing: 0.1, paddingVertical: 20 },
  addressContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  addressText: {
    fontSize: 20,
    color: 'grey',
    fontWeight: '500',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  orderDetailsContainer: { borderTopWidth: 1, borderColor: 'lightgrey', paddingTop: 10 },
  orderItemText: { fontSize: 18, color: 'grey', fontWeight: '500', letterSpacing: 0.5 },
  buttonContainer: {
    backgroundColor: '#3FC060',
    marginTop: 'auto',
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    paddingVertical: 15,
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
